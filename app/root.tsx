import type { LinksFunction } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import fonts from "@fontsource-variable/source-code-pro/wght.css?url";
import tailwind from "~/styles/tailwind.css?url";
import docsearch from "~/styles/docsearch.css?url";
import NotFoundPage from "~/components/NotFoundPage";
import Card from "~/components/Card";
import EmptyCard from "~/components/EmptyCard";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import "decimal.js-light";

try {
  Object.defineProperty(BigInt.prototype, "toJSON", {
    get() {
      "use strict";
      return () => String(this);
    },
  });
} catch (e) {
  console.warn("Unable to define toJSON on BigInt.prototype");
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwind },
  { rel: "stylesheet", href: docsearch },
  { rel: "stylesheet", href: fonts },
  { rel: "stylesheet", href: "/fonts/fonts.css" },
];

function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
        <link
          rel="preload"
          href="/fonts/CircularXXWeb-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/CircularXXWeb-Bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/CircularXXWeb-Book.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/CircularXXWeb-Medium.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="JetKVM" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#051946" />
        <meta name="description" content="JetKVM - Control any computer remotely" />
        <Meta />
        <Links />
        <script
          defer
          data-domain="jetkvm.com"
          data-api="https://thinkbeforeafter.cloudindex.workers.dev/api/occasion"
          src="https://thinkbeforeafter.cloudindex.workers.dev/js/playwright.js"
        ></script>
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <a rel="me" className="hidden" href="https://mastodon.social/@jetkvm">
          Mastodon
        </a>
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  // @ts-ignore
  const errorMessage = error.data?.error?.message || error?.message;
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) return <NotFoundPage />;
  }

  return (
    <html>
      <head>
        <title>JetKVM</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="JetKVM" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#051946" />
        <meta name="description" content="JetKVM - Control any computer remotely" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="h-full w-full">
          <div className="flex h-full items-center justify-center">
            <div className="w-full max-w-2xl">
              <EmptyCard
                IconElm={ExclamationTriangleIcon}
                headline="Oh no!"
                description="Something went wrong. Please try again later or contact support"
                BtnElm={
                  errorMessage && (
                    <Card>
                      <div className="flex items-center font-mono">
                        <div className="flex p-2 text-black">
                          <span className="text-sm">{errorMessage}</span>
                        </div>
                      </div>
                    </Card>
                  )
                }
              />
            </div>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}

export default App;
