import clsx from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";
import { cx } from "../cva.config";

type CardPropsType = {
  children: React.ReactNode;
  className?: string;
};

export const GridCard = ({
  children,
  cardClassName,
}: {
  children: React.ReactNode;
  cardClassName?: string;
}) => {
  return (
    <Card className={cx("overflow-hidden", cardClassName)}>
      <div className="relative h-full">
        <div className="grid-card absolute inset-0 z-0 h-full w-full" />
        <div className="absolute inset-0 z-0 h-full w-full rotate-0 bg-grid-blue-100/[25%]" />
        <div className="isolate h-full">{children}</div>
      </div>
    </Card>
  );
};

export default function Card({ children, className }: CardPropsType) {
  return (
    <div
      className={twMerge(
        clsx(
          "w-full rounded-md bg-white shadow outline outline-1 outline-gray-800/[20%]",
          className,
        ),
      )}
    >
      {children}
    </div>
  );
}
