import { useCallback, useEffect, useState } from "react";
import { Link } from "@remix-run/react";
import { cx } from "~/cva.config";

type TableOfContentsType = {
  id: string;
  title: string;
  level: number;
  children: Omit<TableOfContentsType, "children">[];
};

function useTableOfContents(tableOfContents: TableOfContentsType[]) {
  let [currentSection, setCurrentSection] = useState(tableOfContents[0]?.id);

  let getHeadings = useCallback((tableOfContents: TableOfContentsType[]) => {
    return tableOfContents
      .flatMap((node: TableOfContentsType) => [
        node.id,
        ...node.children.map(child => child.id),
      ])
      .map((id: string) => {
        let el = document.getElementById(id);
        if (!el) return null;

        let style = window.getComputedStyle(el);
        let scrollMt = parseFloat(style.scrollMarginTop);

        let top = window.scrollY + el.getBoundingClientRect().top - scrollMt;
        return { id, top };
      })
      .filter(x => x) as { id: string; top: number }[];
  }, []);

  useEffect(() => {
    if (tableOfContents.length === 0) return;
    let headings = getHeadings(tableOfContents);

    function onScroll() {
      let top = window.scrollY;
      let current = headings[0].id;
      for (let heading of headings) {
        if (top >= heading.top) {
          current = heading?.id;
        } else {
          break;
        }
      }
      setCurrentSection(current);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [getHeadings, tableOfContents]);

  return currentSection;
}

export default function TableOfContents({
  tableOfContents,
}: {
  tableOfContents: TableOfContentsType[];
}) {
  let currentSection = useTableOfContents(tableOfContents);
  const isActive = (section: { id: string; children?: Array<{ id: string }> }) => {
    if (section.id === currentSection) return true;
    if (!section.children) return false;

    return section.children.findIndex(isActive) > -1;
  };

  return (
    <nav aria-labelledby="on-this-page-title" className="w-56">
      {tableOfContents.length > 0 && (
        <>
          <h2
            id="on-this-page-title"
            className="font-display text-sm font-semibold text-black"
          >
            On this page
          </h2>
          <ol role="list" className="mt-4 space-y-3 text-sm">
            {tableOfContents.map(section => (
              <li key={section.id}>
                <h3>
                  <Link
                    to={`#${section.id}`}
                    className={cx(
                      isActive(section) ? "!text-blue-700" : "!text-slate-700 transition",
                    )}
                  >
                    {section.title}
                  </Link>
                </h3>
                {section.children.length > 0 && (
                  <ol role="list" className="mt-2 space-y-2 pl-5 text-slate-700">
                    {section.children.map(subSection => (
                      <li key={subSection.id}>
                        <Link
                          to={`#${subSection.id}`}
                          className={cx(
                            "truncate font-display text-sm",
                            isActive(subSection)
                              ? "text-blue-700"
                              : "hover:text-slate-700",
                          )}
                        >
                          {subSection.title}
                        </Link>
                      </li>
                    ))}
                  </ol>
                )}
              </li>
            ))}
          </ol>
        </>
      )}
    </nav>
  );
}
