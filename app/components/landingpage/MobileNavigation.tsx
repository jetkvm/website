import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { DocsSidebar } from "~/components/landingpage/DocsSidebar";
import { Link, useLocation } from "@remix-run/react";
import { Button } from "../Button";

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      stroke="currentColor"
      {...props}
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      {...props}
    >
      <path d="M5 5l14 14M19 5l-14 14" />
    </svg>
  );
}

type MobileNavigationProps = {
  navigation: any;
};

export function MobileNavigation({ navigation }: MobileNavigationProps) {
  let location = useLocation();
  let [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (location.pathname) setIsOpen(false);
  }, [location.key]);

  return (
    <>
      <Button
        size="SM"
        theme="light"
        onClick={() => setIsOpen(true)}
        TrailingIcon={MenuIcon}
      />
      <Dialog
        open={isOpen}
        onClose={setIsOpen}
        className="fixed inset-0 z-50 flex items-start overflow-y-auto bg-slate-900/50 pr-10 backdrop-blur lg:hidden"
        aria-label="Navigation"
      >
        <Dialog.Panel className="min-h-full w-full max-w-xs bg-white px-4 pb-12 pt-5 sm:px-6">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close navigation"
            >
              <CloseIcon className="h-6 w-6 stroke-slate-500" />
            </button>
            <Link to="/docs" className="ml-6" aria-label="Home page">
              <img alt="JetKVM" src="/logo-blue.png" className="h-6  " />
            </Link>
          </div>
          <DocsSidebar navigation={navigation} className="mt-5 px-1" />
        </Dialog.Panel>
      </Dialog>
    </>
  );
}
