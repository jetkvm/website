import { LoaderFunctionArgs, redirect } from "@remix-run/node";

export function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchParams = url.searchParams.toString();
  const kickstarterUrl = new URL("https://www.kickstarter.com/projects/jetkvm/jetkvm");
  if (searchParams) {
    kickstarterUrl.search = searchParams;
  }
  return redirect(kickstarterUrl.toString());
}
