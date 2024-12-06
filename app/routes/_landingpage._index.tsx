import Hero from "~/components/landingpage/Hero";
import { MetaFunction } from "@remix-run/node";

import { openGraphTags } from "~/utils";
import React, { useEffect, useState } from "react";
import Container from "~/components/Container";
import { LinkButton } from "~/components/Button";
import { DiscordIcon, YCombinatorIcon } from "~/components/Icons";
import KickstarterIcon from "~/assets/kickstarter-icon.svg";

export const meta: MetaFunction = ({ data }) => {
  return [
    ...openGraphTags(
      "JetKVM - Control any computer remotely",
      "JetKVM is a high-performance, open-source KVM over IP (Keyboard, Video, Mouse) solution designed for efficient remote management of computers, servers, and workstations. Whether you're dealing with boot failures, installing a new operating system, adjusting BIOS settings, or simply taking control of a machine from afar, JetKVM provides the tools to get it done effectively.",
      "JetKVM - Control any computer remotely",
      "Next generation KVM over IP"
    ),
  ];
};

export default function IndexRoute() {
  const [contentLoaded, setContentLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = "/jetkvm-device-still3.png";
    img.onload = () => setContentLoaded(true);
  }, []);

  return (
    <div className="h-[10000px] max-h-[calc(100vh-60px)] min-h-[768px]">
      <Hero>
        <div className="flex h-full items-center justify-center">
          <div className="z-10 mx-auto max-w-2xl ">
            {contentLoaded && (
              <Container className="space-y-1 text-center">
                <div
                  className="animate-fadeIn space-y-4 opacity-0"
                  style={{ animationDelay: "1000ms" }}
                >
                  <h1 className="text-6xl font-bold tracking-tight text-black sm:text-5xl md:text-6xl">
                    Control any computer remotely
                  </h1>
                  <h2 className="text-xl font-medium text-slate-700 md:text-2xl">
                    Next generation open-source KVM over IP for $69
                  </h2>
                </div>
                <div
                  className="-ml-6 flex animate-fadeInScaleFloat justify-center opacity-0 md:-ml-0 md:-mt-6"
                  style={{ animationDelay: "0ms" }}
                >
                  <img
                    src="/jetkvm-device-still3.png"
                    alt="JetKVM device"
                    className="w-[80%]"
                  />
                </div>
                <div
                  className="-mt-8 flex animate-fadeIn flex-col items-center justify-center gap-x-8 gap-y-8 opacity-0"
                  style={{ animationDelay: "1500ms" }}
                >
                  <div className="flex flex-wrap justify-center gap-x-6 gap-y-6">
                    <div className="">
                      <LinkButton
                        size="XL"
                        theme="light"
                        className="plausible-event-name=Go+To+Kickstarter"
                        text="Go to Kickstarter"
                        LeadingIcon={({ className }) => (
                          <img className={className} src={KickstarterIcon} />
                        )}
                        to="https://www.kickstarter.com/projects/jetkvm/jetkvm?ref=5sxcqi"
                      />
                    </div>
                    <LinkButton
                      size="XL"
                      theme="blank"
                      LeadingIcon={DiscordIcon}
                      text="Join our Discord"
                      to="https://jetkvm.com/discord"
                    />
                  </div>
                  <YCombinatorIcon className="md:block hidden w-32 text-black" />
                </div>
              </Container>
            )}
          </div>
        </div>
      </Hero>
    </div>
  );
}
