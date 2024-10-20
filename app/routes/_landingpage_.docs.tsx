import { json, LoaderFunctionArgs } from "@remix-run/node";
import { generateNavigationObject, Section } from "~/services/file.server";
import { Outlet, useLoaderData } from "@remix-run/react";
import { DocsNavbar } from "~/components/landingpage/DocsNavbar";
import Container from "~/components/Container";
import { DocsSidebar } from "~/components/landingpage/DocsSidebar";
import Footer from "~/components/landingpage/Footer";
import { openGraphTags } from "../utils";

export { headers } from "~/routes/_landingpage";

let cachedNavigation: Section[] = [];
export const loader = async ({ request }: LoaderFunctionArgs) => {
  if (cachedNavigation.length > 0 && process.env.NODE_ENV === "production") {
    console.log("Returning cached navigation");
    return json({ navigation: cachedNavigation });
  }

  const navigation = await generateNavigationObject();
  // Preferred order for sections
  const preferredOrder = [
    "Getting Started",
    "Peripheral Devices",
    "Networking",
    "Video",
    "Advanced Usage",
  ];

  // Sorting function for sections
  const sortedNavigation = navigation.sort((a, b) => {
    const indexA = preferredOrder.indexOf(a.title);
    const indexB = preferredOrder.indexOf(b.title);

    if (indexA > -1 && indexB > -1) {
      // Both titles are in the preferred order list
      return indexA - indexB;
    } else if (indexA > -1) {
      // Only title A is in the list
      return -1;
    } else if (indexB > -1) {
      // Only title B is in the list
      return 1;
    } else {
      // Neither title is in the list, sort alphabetically
      return a.title.localeCompare(b.title);
    }
  });

  cachedNavigation = sortedNavigation;

  return json({ navigation: sortedNavigation });
};

export default function DocsRoute() {
  let { navigation } = useLoaderData<typeof loader>();
  return (
    <div className="relative h-auto">
      <DocsNavbar navigation={navigation} isLoggedIn={false} />

      <Container className="relative flex h-auto justify-center">
        <div className="hidden lg:relative lg:block lg:flex-none">
          <div className="absolute inset-y-0 right-0 w-[50vw]" />
          <div className="absolute bottom-0 right-0 top-16 hidden h-12 w-px bg-gradient-to-t from-slate-800" />
          <div className="absolute bottom-0 right-0 top-28 hidden w-px bg-slate-800" />
          <div className="sticky top-[105px] -ml-0.5 h-[calc(100vh-4.5rem)] overflow-y-auto overflow-x-hidden border-r border-dashed border-r-gray-800/20 pb-16 pl-0.5 pt-8">
            <DocsSidebar navigation={navigation} className="w-64 pr-8" />
          </div>
        </div>
        <Outlet />
      </Container>
      <Footer />
    </div>
  );
}
