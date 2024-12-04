import React from "react";
import { LinkButton } from "~/components/Button";
import { MobileNavigation } from "~/components/landingpage/MobileNavigation";
import Container from "~/components/Container";
import { Search } from "~/components/landingpage/Search";
import { Link } from "@remix-run/react";
import { ChevronLeftIcon } from "@heroicons/react/16/solid";
import { DiscordIcon } from "../Icons";

type HeaderProps = { navigation: any; isLoggedIn: boolean | undefined };

export function DocsNavbar({ navigation, isLoggedIn }: HeaderProps) {
  return (
    <div className="sticky top-0 z-50 select-none backdrop-blur">
      <div className="bg-grid relative isolate overflow-hidden bg-blue-700/90 transition-colors duration-300 hover:bg-blue-700">
        <div
          className="absolute inset-0 -z-20 overflow-hidden bg-grid-lg-blue-500/30"
          style={{
            maskImage:
              "radial-gradient(ellipse at center, rgba(0,0,0,1), transparent 75%",
          }}
        />
        <div
          className="absolute inset-0 -z-10 overflow-hidden"
          style={{ backgroundImage: "url(/bg-noise.png)", backgroundRepeat: "repeat" }}
        />
        <Link to="/" prefetch="intent">
          <Container>
            <div className="flex items-center gap-x-2 py-2">
              <ChevronLeftIcon className="w-4 text-white/90" />
              <span className="font-display text-[13px] text-white">Back to website</span>
            </div>
          </Container>
        </Link>
      </div>

      <Container>
        <header className="flex items-center justify-between border-b border-b-gray-800/20 py-4 md:gap-x-24">
          <div className="mr-6 flex lg:hidden">
            <MobileNavigation navigation={navigation} />
          </div>
          <Link to="/docs" className="group flex shrink-0 items-end gap-x-1">
            <img
              alt="JetKVM for GitHub Actions"
              src="/logo-blue.png"
              className="block h-[24px] shrink-0 fill-slate-700"
            />
            <span className="-translate-y-[1px] transform font-display text-xs font-semibold text-slate-600 ">
              Docs
            </span>
          </Link>
          {/* <div className="lg:w-full lg:max-w-2xl"> */}
          <div className="hidden">
            <Search />
          </div>
          <div className="hidden h-[36px] items-center gap-x-4 lg:flex">
          <LinkButton
              size="SM"
              theme="light"
              to="/discord"
              text="Join Discord"
              LeadingIcon={DiscordIcon}
            />
            <LinkButton
              size="SM"
              theme="light"
              to="https://app.jetkvm.com"
              text="Cloud Dashboard"
            />
          </div>
        </header>
      </Container>
    </div>
  );
}
