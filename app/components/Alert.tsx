import React from "react";
import { ExclamationCircleIcon } from "@heroicons/react/16/solid";
import Card from "./Card";

export default function Alert({
  headline,
  description,
  BtnElm,
}: {
  headline: string;
  description: string | React.ReactNode;
  BtnElm?: React.ReactNode;
}) {
  return (
    <Card className="bg-yellow-50 px-4 py-5 outline-yellow-700/40">
      <div className="flex justify-between">
        <div className="flex items-center gap-x-4">
          <ExclamationCircleIcon
            className="h-5 w-5 shrink-0 text-black"
            aria-hidden="true"
          />
          <div className="space-y-1.5">
            <h3 className="text-base font-bold leading-none text-black">{headline}</h3>
            <div className="text-sm leading-snug text-yellow-900">{description}</div>
          </div>
        </div>
        {BtnElm && BtnElm}
      </div>
    </Card>
  );
}
