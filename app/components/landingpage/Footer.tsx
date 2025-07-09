import Container from "~/components/Container";
import type { LinkProps } from "@remix-run/react";
import { Link } from "@remix-run/react";
import React from "react";
import { DiscordIcon } from "~/components/Icons";
import ExtLink from "~/components/ExtLink";

const FooterLink = ({
  children,
  to,
}: {
  children: React.ReactNode;
  to: LinkProps["to"];
}) => (
  <Link
    to={to}
    className="block whitespace-nowrap font-display text-sm leading-none text-slate-600 hover:text-black"
  >
    {children}
  </Link>
);

export default function Footer() {
  const CurrentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-t-slate-800/20 bg-white">
      <Container>
        <div className="flex flex-col justify-between gap-x-16 gap-y-8 py-8 md:flex-row">
          <div className="flex w-full justify-between gap-y-4 md:gap-y-16 ">
            <div>
              <h4 className="text-lg font-bold text-blue-700">JetKVM</h4>
              <p className="text-base text-slate-600 md:text-sm">
                Control any computer remotely
              </p>
            </div>
          </div>
          <div className="flex items-center gap-x-4 grayscale">
            <ExtLink href="https://jetkvm.com/discord">
              <DiscordIcon className="h-8 w-8 shrink-0" />
            </ExtLink>
          </div>
        </div>
        <div className="border-t border-t-slate-300 py-4 text-xs leading-none text-slate-500 md:text-sm">
          © 2024-{CurrentYear} BuildJet, Inc. - All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
