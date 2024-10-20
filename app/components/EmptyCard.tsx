import { GridCard } from "~/components/Card";
import React from "react";

type Props = {
  IconElm?: React.FC<any>;
  headline: string;
  description?: string;
  BtnElm?: React.ReactNode;
};

export default function EmptyCard({ IconElm, headline, description, BtnElm }: Props) {
  return (
    <GridCard>
      <div className="flex min-h-[256px] w-full flex-col items-center justify-center gap-y-4 px-4 py-5 text-center">
        <div className="max-w-[90%] space-y-1.5 text-center md:max-w-[60%]">
          <div className="space-y-2">
            {IconElm && <IconElm className="mx-auto h-6 w-6 text-blue-600" />}
            <h4 className="text-base font-bold leading-none">{headline}</h4>
          </div>
          <p className="mx-auto text-sm  text-slate-600">{description}</p>
        </div>
        {BtnElm}
      </div>
    </GridCard>
  );
}
