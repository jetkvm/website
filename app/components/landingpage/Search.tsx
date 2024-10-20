import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import * as DocSearch from "@docsearch/react";
import { Link, useNavigate } from "@remix-run/react";
import Card from "~/components/Card";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { Button } from "../Button";

type HitProps = {
  hit: { url: string };
  children: React.ReactNode;
};

const algoliaOptions = {
  appId: "5I4EPST2WK",
  apiKey: "4f955170e0f326372dfea6b36f3f8aa7",
  indexName: "prod_buildjet_gha",
};

function Hit({ hit, children }: HitProps) {
  return <Link to={hit.url}>{children}</Link>;
}

export interface UseDocSearchKeyboardEventsProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onInput?: (event: KeyboardEvent) => void;
  searchButtonRef?: React.RefObject<HTMLButtonElement>;
}

function isEditingContent(event: KeyboardEvent): boolean {
  const element = event.target as HTMLElement;
  const tagName = element.tagName;

  return (
    element.isContentEditable ||
    tagName === "INPUT" ||
    tagName === "SELECT" ||
    tagName === "TEXTAREA"
  );
}

export function useDocSearchKeyboardEvents({
  isOpen,
  onOpen,
  onClose,
  onInput,
  searchButtonRef,
}: UseDocSearchKeyboardEventsProps) {
  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      function open() {
        // We check that no other DocSearch modal is showing before opening
        // another one.
        if (!document.body.classList.contains("DocSearch--active")) {
          onOpen();
        }
      }

      if (
        (event.keyCode === 27 && isOpen) ||
        // The `Cmd+K` shortcut both opens and closes the modal.
        // We need to check for `event.key` because it can be `undefined` with
        // Chrome's autofill feature.
        // See https://github.com/paperjs/paper.js/issues/1398
        (event.key?.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) ||
        // The `/` shortcut opens but doesn't close the modal because it's
        // a character.
        (!isEditingContent(event) && event.key === "/" && !isOpen)
      ) {
        event.preventDefault();

        if (isOpen) {
          onClose();
        } else if (!document.body.classList.contains("DocSearch--active")) {
          open();
        }
      }

      if (
        searchButtonRef &&
        searchButtonRef.current === document.activeElement &&
        onInput
      ) {
        if (/[a-zA-Z0-9]/.test(String.fromCharCode(event.keyCode))) {
          onInput(event);
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onOpen, onClose, onInput, searchButtonRef]);
}

export function Search() {
  let [isOpen, setIsOpen] = useState(false);
  let [modifierKey, setModifierKey] = useState();
  const onOpen = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);
  const navigate = useNavigate();
  const onClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  useDocSearchKeyboardEvents({ isOpen, onOpen, onClose });

  useEffect(() => {
    setModifierKey(
      // @ts-ignore
      !/(Mac|iPhone|iPod|iPad)/i.test(navigator?.platform) ? "Ctrl " : "⌘",
    );
  }, []);

  return (
    <>
      <div>
        <div className="block w-full lg:hidden">
          <Button
            size="SM"
            theme="light"
            fullWidth
            onClick={() => {
              setIsOpen(true);
            }}
            TrailingIcon={MagnifyingGlassIcon}
          />
        </div>

        <Card className="group hidden w-full cursor-pointer py-2 pl-4 pr-3.5 text-sm transition-colors hover:bg-blue-50/10 lg:block">
          <div
            onClick={() => {
              setIsOpen(true);
            }}
            className="flex h-full items-center justify-center"
          >
            <MagnifyingGlassIcon className="h-4 w-4 flex-none fill-slate-400 group-hover:fill-slate-400" />
            <span className="ml-2 font-display text-sm text-slate-600">Search...</span>
            {modifierKey && (
              <kbd className="ml-auto block font-medium text-slate-600">
                <kbd className="font-display">{modifierKey}</kbd>
                <kbd className="font-display">K</kbd>
              </kbd>
            )}
          </div>
        </Card>
      </div>
      {isOpen &&
        createPortal(
          <DocSearch.DocSearchModal
            appId={algoliaOptions.appId}
            apiKey={algoliaOptions.apiKey}
            indexName={algoliaOptions.indexName}
            initialScrollY={window.scrollY}
            onClose={onClose}
            hitComponent={Hit}
            navigator={{
              navigate({ itemUrl }) {
                navigate(itemUrl);
              },
            }}
          />,
          document.body,
        )}
    </>
  );
}
