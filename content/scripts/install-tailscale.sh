#!/bin/sh

set -eu

# All the code is wrapped in a main function that gets called at the
# bottom of the file, so that a truncated partial download doesn't end
# up executing half a script.
main() {

	TAILSCALE_VERSION="1.88.1"
	JETKVM_IP=""
	AUTO_YES=false

	# Parse command line arguments
	while [ $# -gt 0 ]; do
		case $1 in
		-v | --version)
			TAILSCALE_VERSION="$2"
			shift 2
			;;
		-y | --yes)
			AUTO_YES=true
			shift
			;;
		*)
			JETKVM_IP="$1"
			shift
			;;
		esac
	done

	if [ -z "$JETKVM_IP" ]; then
		echo "ERROR: JetKVM IP address is required"
		echo ""
		echo "Usage: $0 [-v|--version <TAILSCALE_VERSION>] [-y|--yes] <JETKVM_IP>"
		echo ""
		echo "Options:"
		echo "  -v, --version  Specify Tailscale version (default: $TAILSCALE_VERSION)"
		echo "  -y, --yes      Automatically answer yes to confirmation prompt"
		echo ""
		echo "Examples:"
		echo "  $0 192.168.1.64"
		echo "  $0 -v 1.88.1 -y 192.168.1.64"
		echo "  $0 --version 1.88.1 192.168.1.64"
		echo ""
		echo "Default Tailscale version: $TAILSCALE_VERSION (first version to support JetKVM)"
		exit 1
	fi

	export TAILSCALE_VERSION

	# Confirmation prompt (unless auto-yes is enabled)
	if [ "$AUTO_YES" = false ]; then
		echo "───────────────────────────────────────────────────────────"
		echo "           JetKVM Tailscale Installation"
		echo "───────────────────────────────────────────────────────────"
		echo ""
		echo "  JetKVM IP:            $JETKVM_IP"
		echo "  Tailscale Version:    $TAILSCALE_VERSION"
		echo ""
		echo "  Note: The device will be rebooted during installation"
		echo ""

		if [ -t 0 ]; then
			# stdin is a TTY
			printf "Continue? [y/N]: "
			read -r response
		else
			# stdin is NOT a TTY (e.g., curl | sh). Read from the terminal.
			printf "Continue? [y/N]: " >/dev/tty
			read -r response </dev/tty
		fi

		case "$response" in
		[yY] | [yY][eE][sS])
			echo ""
			;;
		*)
			echo "Installation cancelled"
			exit 0
			;;
		esac
	else
		echo "Auto-confirmation enabled, proceeding with installation..."
		echo ""
	fi
	# Check if the JetKVM device is reachable
	echo "[1/7] Checking if JetKVM device is reachable..."
	if ! ping -c 3 -W 5 "$JETKVM_IP" >/dev/null 2>&1; then
		echo "ERROR: JetKVM device at $JETKVM_IP is not reachable"
		echo "       Please verify the IP address and ensure the device is powered on and connected to the network"
		exit 1
	fi
	echo "       Device is reachable"

	# Check if SSH access is available (Developer Mode enabled)
	echo "       Checking SSH access (Developer Mode)..."

	# First, test SSH connectivity without BatchMode to get proper error messages
	SSH_TEST_OUTPUT=$(ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
		-o PreferredAuthentications=publickey -o PubkeyAuthentication=yes -o PasswordAuthentication=no \
		root@"$JETKVM_IP" 'echo "SSH OK"' 2>&1) || SSH_EXIT_CODE=$?

	if [ "${SSH_EXIT_CODE:-0}" -ne 0 ]; then
		echo ""
		# Check if it's a connection refused (port 22 not open - Developer Mode not enabled)
		if echo "$SSH_TEST_OUTPUT" | grep -qi "connection refused\|connection timed out"; then
			echo "ERROR: SSH connection refused"
			echo "       Most likely cause: Developer Mode is not enabled on the JetKVM device."
			echo ""
			echo "       Follow the guide at:"
			echo "       https://jetkvm.com/docs/advanced-usage/developing#developer-mode"
			echo ""
		# Check if it's a permission denied (SSH enabled but no key configured)
		elif echo "$SSH_TEST_OUTPUT" | grep -qi "permission denied\|authentication failed"; then
			echo "ERROR: SSH authentication failed"
			echo "       Most likely cause: Developer Mode is enabled, but your SSH public key is not added."
			echo ""
			echo "       Follow the guide at:"
			echo "       https://jetkvm.com/docs/advanced-usage/developing#developer-mode"
			echo ""
		else
			echo "ERROR: SSH connection failed - unknown cause"
			echo "       Error details: $SSH_TEST_OUTPUT"
			echo ""
			echo "       This may indicate Developer Mode issues. Please check the guide at:"
			echo "       https://jetkvm.com/docs/advanced-usage/developing#developer-mode"
			echo ""
		fi
		exit 1
	fi
	echo "       SSH access confirmed"

	echo "[2/7] Downloading Tailscale $TAILSCALE_VERSION checksum..."
	HASH=$(curl -fsSL https://pkgs.tailscale.com/stable/tailscale_"${TAILSCALE_VERSION}"_arm.tgz.sha256)

	echo "[3/7] Downloading Tailscale $TAILSCALE_VERSION package..."
	TMP_FILE=$(mktemp -t tailscale.XXXXXX.tgz)
	curl -fSL https://pkgs.tailscale.com/stable/tailscale_"${TAILSCALE_VERSION}"_arm.tgz -o "$TMP_FILE" >/dev/null 2>&1

	echo "[4/7] Verifying package integrity..."
	LOCAL_HASH=$(sha256sum "$TMP_FILE" | awk '{print $1}')
	if [ "$HASH" != "$LOCAL_HASH" ]; then
		rm -f "$TMP_FILE"
		echo "ERROR: Package verification failed!"
		echo "       Expected: $HASH"
		echo "       Got:      $LOCAL_HASH"
		exit 1
	fi
	echo "       Package verification successful"

	echo "[5/7] Transferring Tailscale package to JetKVM..."
	ssh root@"${JETKVM_IP}" "cat > /userdata/tailscale.tgz" <"$TMP_FILE"

	echo "[6/7] Installing and configuring Tailscale on JetKVM..."
	ssh -o ServerAliveInterval=1 -o ServerAliveCountMax=1 \
		root@"$JETKVM_IP" \
		"export TAILSCALE_VERSION=$TAILSCALE_VERSION; ash -s" 2>/dev/null <<'EOF' || true
  set -e

  cd /userdata

  echo "       Extracting package..."
  tar xf ./tailscale.tgz

  # Remove the old tailscale directory
  rm -rf ./tailscale

  # Move the new tailscale directory to the correct location (tailscale configure assumes this path)
  mv "./tailscale_${TAILSCALE_VERSION}_arm" tailscale

  echo "       Configuring Tailscale for JetKVM..."
  cd ./tailscale
  ./tailscale configure jetkvm 2>&1 >/dev/null

  sync

  echo "       Rebooting JetKVM device..."

  # Fire the reboot asynchronously, then keep the session open
  ( sleep 1; reboot ) &
  # Block until the kernel kills this session (i.e., only returns once SSH drops)
  exec tail -f /dev/null
EOF

	echo "       Waiting for JetKVM to reboot and come back online..."
	i=1
	while [ "$i" -le 120 ]; do
		echo "       Checking device status... ($i/120s)"
		if ssh -q -o ConnectTimeout=2 -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
			root@"$JETKVM_IP" 'tailscale version' >/dev/null 2>&1; then
			echo "       JetKVM is back online with Tailscale installed!"
			break
		fi

		if [ "$i" -eq 120 ]; then
			echo "ERROR: Timeout - JetKVM did not come back online within 2 minutes"
			echo "       Please check the device status manually"
			exit 1
		fi

		i=$((i + 1))
		sleep 1
	done

	echo "[7/7] Starting Tailscale service..."
	ssh root@"$JETKVM_IP" "tailscale up"
	echo ""
	echo "SUCCESS: Tailscale installation completed!"
	echo "         Your JetKVM device is now ready to connect to your Tailscale network."
}

main "$@"
