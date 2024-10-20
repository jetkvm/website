import { redirect } from "@remix-run/node";

export function loader() {
  return redirect("https://jetkvm.com/docs/getting-started/quick-start");
}
