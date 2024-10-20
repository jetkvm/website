import { LinkButton } from "~/components/Button";
import React from "react";
import { YCombinatorIcon } from "~/components/Icons";
import clsx from "clsx";
import { formatters } from "~/utils";
import { ChevronLeftIcon } from "@heroicons/react/16/solid";
import { Link } from "@remix-run/react";
import Container from "~/components/Container";
import Card from "~/components/Card";

function Base({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full">
      <div className="relative isolate h-full overflow-hidden">{children}</div>
    </div>
  );
}

function LargeCenter({
  headline,
  description,
  slogan,
  ctaText,
  ctaTo,
  videoSrc,
}: {
  headline: string;
  description: string;
  slogan?: string;
  ctaText?: string;
  ctaTo?: string;
  videoSrc: string;
}) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="z-10 mx-auto max-w-3xl py-20 sm:py-56 3xl:py-56">
        <Container className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl">
            {headline}
          </h1>
          <div>
            <h2 className="mt-6 text-xl font-medium text-white md:text-2xl">
              {description}
            </h2>
            <h3 className="text-xl text-slate-300 md:text-2xl">{slogan}</h3>
          </div>
          <div className="mt-10 flex items-center justify-center gap-x-8">
            <div className="hidden md:block">
              <LinkButton
                size="LG"
                theme="light"
                text={ctaText || "Get started"}
                to={ctaTo || "/dashboard"}
                className="!border-white/10 font-display !text-blue-700 !shadow-none"
              />
            </div>
            <div className="block md:hidden">
              <LinkButton
                size="MD"
                theme="light"
                text="Get started"
                to="/dashboard"
                className="!border-white/10 font-display !text-blue-700 !shadow-none"
              />
            </div>
            <YCombinatorIcon className="w-32 text-white" />
          </div>
        </Container>
      </div>
    </div>
  );
}

function LargeLeft({
  headline,
  description,
  slogan,
  illustration,
}: {
  headline: string;
  description: string;
  slogan?: string;
  illustration: string;
}) {
  return (
    <Container className="text-center">
      <div className="flex h-full w-full items-center justify-start gap-x-8">
        <div className="z-10 w-full max-w-xl grow text-left">
          <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl">
            {headline}
          </h1>
          <div>
            <h2 className="mt-6 text-xl font-medium text-white md:text-2xl">
              {description}
            </h2>
            <h3 className="text-xl text-slate-300 md:text-2xl">{slogan}</h3>
          </div>
          <div className="mt-10 flex items-center justify-start gap-x-8">
            <div className="hidden md:block">
              <LinkButton
                size="LG"
                theme="light"
                text="Get started"
                to="/dashboard"
                className="!border-white/10 font-display !text-blue-700 !shadow-none"
              />
            </div>
            <div className="block md:hidden">
              <LinkButton
                size="MD"
                theme="light"
                text="Get started"
                to="/dashboard"
                className="!border-white/10 font-display !text-blue-700 !shadow-none"
              />
            </div>
            <YCombinatorIcon className="w-32 text-white" />
          </div>
        </div>
        <div className="w-full">
          <Card>
            <div className="overflow-hidden rounded-md p-1">
              <img src={illustration} alt="" />
            </div>
          </Card>
        </div>
      </div>
    </Container>
  );
}

function Small({
  headline,
  description,
  children,
  align = "center",
  divider,
  className,
}: {
  children?: React.ReactNode;
  headline: string;
  description?: string;
  align?: "left" | "center";
  divider?: boolean;
  className?: string;
}) {
  return (
    <>
      <div
        className={clsx(
          "z-10 pb-12 pt-20 md:py-20",
          className,
          divider && "pb-[calc(64px-1px)]",
          align === "left" && "mr-auto text-left",
          align === "center" && "mx-auto max-w-3xl text-center",
        )}
      >
        <h1 className="text-4xl font-bold tracking-tight text-black md:text-5xl">
          {headline}
        </h1>
        {divider && <div className="mt-4 block h-[1px] w-full bg-slate-800/20" />}
        {description && (
          <div className={clsx("max-w-xl", align === "center" ? "mx-auto" : "")}>
            <h2 className="mt-2 font-display text-lg text-slate-700">{description}</h2>
          </div>
        )}
      </div>
      {children && <div className="mb-16">{children}</div>}
    </>
  );
}

export function PostHero({
  category,
  headline,
  description,
  children,
  align = "center",
  divider,
  date,
  authors,
}: {
  category?: string;
  children?: React.ReactNode;
  headline: string;
  description?: string;
  align?: "left" | "center";
  divider?: boolean;
  date?: string;
  authors?: { name: string; title?: string }[];
}) {
  return (
    <>
      <div
        className={clsx(
          "z-10",
          align === "left" && "mr-auto text-left",
          align === "center" && "mx-auto max-w-3xl text-center",
        )}
      >
        <div className="mb-6 mt-4">
          <Link
            to="./"
            className="flex gap-x-2 text-white/70 transition-colors hover:text-white"
          >
            <ChevronLeftIcon className="w-4" />
            <span className="font-display text-sm">Back to blog</span>
          </Link>
        </div>
        {category && (
          <div className="mb-4">
            <h2 className="text-lg tracking-wide text-slate-50">{category}</h2>
          </div>
        )}
        <h1 className="text-5xl font-bold tracking-tight text-white">{headline}</h1>

        {description && (
          <div>
            <h2 className="mt-2 text-2xl text-slate-50">{description}</h2>
          </div>
        )}

        {divider && <div className="mt-4 block h-[1px] w-full bg-white" />}

        <div className="mb-6 mt-4">
          <div className="flex items-start gap-x-8">
            {date && (
              <div>
                <div className="font-display text-sm font-medium text-white">
                  {formatters.date(new Date(date))}
                </div>
              </div>
            )}

            {authors?.map(author => (
              <div key={author.name}>
                <div className="space-y-1 font-display text-sm  text-white">
                  <div className="font-display text-sm font-medium">{author.name}</div>
                  {author.title && (
                    <div className="text-xs text-slate-100">{author.title}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {children && <div className="mb-16">{children}</div>}
    </>
  );
}

export default Object.assign(Base, {
  LargeCenter,
  LargeLeft,
  Small,
  PostHero,
});
