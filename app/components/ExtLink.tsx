import React from "react";
import clsx from "clsx";

export default function ExtLink({
  className,
  href,
  id,
  target,
  children,
}: {
  className?: string;
  href: string;
  id?: string;
  target?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      className={clsx(className)}
      target={target ?? "_blank"}
      id={id}
      rel="noopener noreferrer"
      href={href}
    >
      {children}
    </a>
  );
}
