import React from "react";
import clsx from "clsx";
import Card from "~/components/Card";
import { ChevronRightIcon } from "@heroicons/react/16/solid";

type Props = { items: { title: string; content: string }[] };

function AccordionItem({ title, content }: { title: string; content: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div onClick={() => setOpen(x => !x)}>
      <Card className="cursor-pointer">
        <div className="bg-grid-sm-blue-700/[2%]">
          <div className="bg-gradient-to-b from-transparent to-white pb-2 pt-3 transition-all duration-300 hover:to-blue-50/50">
            <dt>
              <div className="flex items-center gap-x-2 px-4 pb-1">
                <span className="flex items-center">
                  <ChevronRightIcon
                    className={clsx(
                      "h-4 w-4 rotate-0 transform text-blue-700 transition duration-300",
                      {
                        "rotate-90": open,
                      },
                    )}
                  />
                </span>

                <div className="select-none font-display font-semibold">{title}</div>
              </div>
            </dt>
            <div className="flex">
              <div
                style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                className={clsx(
                  "grid opacity-0 transition-all duration-300 ease-in-out",
                  { "opacity-100": open },
                )}
              >
                <div className="select-none overflow-hidden px-10 font-display text-base text-slate-600">
                  {content}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function Accordion({ items }: Props) {
  return (
    <div className="space-y-4">
      {items.map(({ title, content }) => (
        <div key={title + content}>
          <AccordionItem title={title} content={content} />
        </div>
      ))}
    </div>
  );
}
