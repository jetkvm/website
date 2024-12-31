import LandingNavbar from "~/components/landingpage/LandingNavbar";
import Container from "~/components/Container";

import { HeadersFunction, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import Footer from "~/components/landingpage/Footer";
import { getGitHubStars } from "../services/github.server";

export const headers: HeadersFunction = () => {
  /*
  This is also the headers for the docs route.
  We have to re-export it in the docs route, because we override the _landingpage layout in the docs.
  Therefore, we need to re-declare the headers in the docs route.

  So, if you change the headers here, make sure you consider the docs route as well.

  Note: We can cache because all the content is static, and the things that are dynamic are handled by the client.
  Like the user's login status - see useIsLoggedIn hook.
*/

  /*
    This implementation leverages the stale-while-revalidate (SWR) strategy to manage caching behavior, aiming to serve cached content for 120 seconds.
    Beyond this duration, the intention is to fetch fresh data from the origin server in the background, while continuing to deliver the cached version to the user until the refresh completes.
    However, Cloudflare, which powers the CDN for DigitalOcean Apps, has a slightly different approach to handling SWR, diverging from the ideal behavior we might expect.

    Cloudflare's take on SWR unfolds as follows:
    - After the cached content officially expires (let's say at 00:00:00), and a new request comes in (imagine at 00:00:01), Cloudflare attempts to retrieve fresh data from the origin server.
      The twist here is that during this initial fetch, Cloudflare does not serve the stale cached content. This means the user experiences a wait time, deviating from the anticipated SWR behavior.

    - For any simultaneous requests (e.g., at 00:00:01) or those made while the origin fetch is ongoing, Cloudflare delivers the "stale" content from the cache.

    Essentially, the very first request following cache expiration incurs a delay as the system fetches new data. Meanwhile, subsequent requests during this interval benefit from the cached content, bypassing the wait time.
    Although this method doesn't fully sidestep the delay for the initial post-expiration request, it offers a middle ground, sparing all users from the latency of cache refreshment.

    For further insights:
      - https://stackoverflow.com/questions/48124415/does-cloudflare-support-stale-while-revalidate
   */
  return {
    "Cache-Control": `public, s-max-age=120, stale-while-revalidate=86400`,
  };
};

export const loader = async () => {
  const githubStars = await getGitHubStars();
  return json({ githubStars });
};

export default function LandingRootRoute() {
  const { githubStars } = useLoaderData<typeof loader>();
  return (
    <div className="grid h-full ">
      <Container>
        <LandingNavbar githubStars={githubStars} />
      </Container>
      <div className="h-full">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
