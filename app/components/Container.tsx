import { twMerge } from "tailwind-merge";
import React from "react";

function Container({ children, className }: { children: any; className?: string }) {
  return (
    <div
      className={twMerge(
        twMerge(
          "mx-auto h-full w-full px-4 sm:max-w-6xl sm:px-8 md:max-w-7xl md:px-12 lg:max-w-8xl",
          className,
        ),
      )}
    >
      {children}
    </div>
  );
}

function Article({ children }: { children: React.ReactNode }) {
  return (
    <Container>
      <div className="grid w-full grid-cols-12">
        <div className="col-span-12 xl:col-span-11 xl:col-start-2">{children}</div>
      </div>
    </Container>
  );
}

export default Object.assign(Container, {
  Article,
});
