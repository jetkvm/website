import React from "react";
import clsx from "clsx";

type ProseProps = {
  className?: string;
  children: React.ReactNode;
  textSize?: "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
};

export function Prose({ className, textSize = "base", children, ...props }: ProseProps) {
  return (
    <div
      className={clsx(
        className,
        {
          "prose-sm": textSize === "sm",
          "prose-base": textSize === "base",
          "prose-lg": textSize === "lg",
          "prose-xl": textSize === "xl",
          "prose-2xl": textSize === "2xl",
          "prose-3xl": textSize === "3xl",
        },
        "prose prose-slate max-w-3xl",

        // headings
        "prose-headings:scroll-mt-28 prose-headings:font-display prose-headings:font-semibold lg:prose-headings:scroll-mt-[8.5rem]",

        "prose-h1:fond-bold prose-h2:font-bold",

        // lead
        "prose-p:text-black/95",

        //table
        "prose-table:my-0 prose-table:max-w-3xl prose-table:text-[15px] prose-table:text-slate-800 prose-thead:border-slate-800/10 prose-tr:border-slate-800/10 prose-td:py-3",

        // links
        "prose-a:font-medium prose-a:text-blue-700",

        // link underline
        "prose-a:no-underline",

        // pre don't do any changes
        // "prose-pre:rounded-xl prose-pre:bg-slate-100 prose-pre:shadow-none dark:prose-pre:bg-slate-800/60 dark:prose-pre:shadow-none dark:prose-pre:ring-1 dark:prose-pre:ring-slate-300/10",
      )}
      {...props}
    >
      {children}
    </div>
  );
}
