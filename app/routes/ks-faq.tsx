import { LoaderFunctionArgs, redirect } from "@remix-run/node";

export function loader() {
  return redirect("/docs/getting-started/ks-faq");
}