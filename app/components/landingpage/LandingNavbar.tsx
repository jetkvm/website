import { Link, NavLink as RemixNavLink } from "@remix-run/react";
import clsx from "clsx";
import ExtLink from "~/components/ExtLink";
import type { ReactNode } from "react";
import React from "react";
import { LinkButton } from "~/components/Button";

type LinkProps = {
  to: string;
  children: ReactNode;
};

type ButtonProps = {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
};

type NavLinkProps = LinkProps | ButtonProps;

const NavLink = (props: NavLinkProps) => {
  const className =
    "font-display shrink-0 whitespace-nowrap rounded-md first:pl-0 py-2 px-3 text-sm text-slate-700 hover:text-blue-700/100 active:text-blue-900/100";

  if ("to" in props) {
    const { to, children } = props;
    if (to.startsWith("http")) {
      return (
        <ExtLink href={to} className={className}>
          {children}
        </ExtLink>
      );
    } else {
      return (
        <RemixNavLink
          to={to}
          prefetch="intent"
          className={({ isActive }) => clsx(className, isActive ? "" : "")}
        >
          {children}
        </RemixNavLink>
      );
    }
  }

  const { onClick, children } = props;
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
};

export default function LandingNavbar() {
  return (
    <div className="w-full flex-col items-center justify-between gap-x-6 space-y-4 pb-0 pt-6 xs:flex xs:flex-row xs:space-y-0 xs:border-b-0">
      <div>
        <Link to="/">
          <img src="/logo-blue.png" className="h-[24px] shrink-0" alt="" />
        </Link>
      </div>
      <div className="flex">
        <div className="flex items-center gap-x-4">
          <NavLink to="/docs">Documentation</NavLink>
          <NavLink to="/contact">Contact us</NavLink>
          {/*<div className="hidden md:block">*/}
          {/*  <NavLink to="/contact">GitHub</NavLink>*/}
          {/*</div>*/}
          {/*<LinkButton*/}
          {/*  size="SM"*/}
          {/*  theme="light"*/}
          {/*  to="https://app.jetkvm.com"*/}
          {/*  text="Cloud Dashboard"*/}
          {/*/>*/}
        </div>
      </div>
    </div>
  );
}
