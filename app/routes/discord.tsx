import { LoaderFunctionArgs, redirect } from "@remix-run/node";

export function loader() {
  return redirect("https://discord.gg/Ky9v3tF7e5");
}
