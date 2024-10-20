import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { getLocalContent, Section } from "~/services/file.server";
import { NotFoundResponse } from "~/services/errors.server";
import { parseMdx } from "~/services/mdx-bundler.server";
import { useLoaderData, useLocation, useRouteLoaderData } from "@remix-run/react";
import { useEffect, useMemo } from "react";
import { getMDXComponent } from "mdx-bundler/client/index.js";
import Card, { GridCard } from "~/components/Card";
import Alert from "~/components/Alert";
import ExclamationTriangleIcon from "@heroicons/react/24/outline/ExclamationTriangleIcon";
import { Prose } from "~/components/landingpage/Prose";
import TableOfContents from "~/components/landingpage/TableOfContents";
import { LinkButton } from "~/components/Button";
import { DiscordIcon } from "~/components/Icons";
import ExtLink from "../components/ExtLink";
import { openGraphTags } from "../utils";

interface Heading {
  id: string;
  title: string;
  level: number;
}

type TableOfContentsType = {
  id: string;
  title: string;
  level: number;
  children: TableOfContentsType[];
};

function extractHeadings(content: string): Heading[] {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  const flatHeadings: Heading[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const title = match[2];
    const id = title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
    flatHeadings.push({ id, title, level });
  }

  return flatHeadings;
}

function transformToHierarchy(headings: Heading[]): TableOfContentsType[] {
  const tableOfContents: TableOfContentsType[] = [];
  let currentParent: TableOfContentsType | null = null;

  headings.forEach(heading => {
    if (heading.level === 2) {
      currentParent = {
        id: heading.id,
        title: heading.title,
        level: heading.level,
        children: [],
      };
      tableOfContents.push(currentParent);
    } else if (heading.level === 3 || heading.level === 4) {
      if (currentParent) {
        currentParent.children.push({
          id: heading.id,
          title: heading.title,
          level: heading.level,
          children: [],
        });
      }
    }
  });

  return tableOfContents;
}

let cachedPosts = new Map<string, any>();
export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  let splat = params["*"];
  const cacheKey = splat || "index";

  // Only cache files in production
  const isProduction = process.env.NODE_ENV === "production";

  // Check if the post is cached
  let cachedPost = cachedPosts.get(cacheKey);

  let parsedPost;

  // Always get the raw file in non-production environments
  // In production, we can use the cache as the files are not expected to change at runtime
  if (cachedPost && isProduction) {
    console.log("Using cached post", cacheKey);
    return json({
      post: cachedPost.mdx as Awaited<ReturnType<typeof parseMdx>>,
      tableOfContents: cachedPost.tableOfContents as TableOfContentsType[],
    });
  }

  const file = await getLocalContent(`docs/${cacheKey}.mdx`);
  if (!file) throw NotFoundResponse();
  if (!file.content) throw NotFoundResponse();
  const mdx = await parseMdx(file.content);
  const headings = extractHeadings(file.content);
  const tableOfContents = transformToHierarchy(headings);

  parsedPost = { mdx, tableOfContents };

  cachedPosts.set(cacheKey, parsedPost);

  return json({
    post: parsedPost.mdx as Awaited<ReturnType<typeof parseMdx>>,
    tableOfContents: parsedPost.tableOfContents as TableOfContentsType[],
  });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const post = data?.post;
  if (!post) return [];
  const { frontmatter } = post;
  const title = frontmatter.title ? "JetKVM Docs - " + frontmatter.title : "JetKVM Docs";
  const description = frontmatter?.description;

  return [
    ...openGraphTags(
      title,
      description || "Next generation KVM over IP",
      title,
      "Next generation KVM over IP",
    ),
  ];
};

export default function DocsRoute() {
  let { post, tableOfContents } = useLoaderData<typeof loader>();
  const { navigation } = useRouteLoaderData("routes/_landingpage_.docs") as {
    navigation: Section[];
  };
  const { code, frontmatter } = post;

  const title = frontmatter.title;
  const location = useLocation();
  let section = navigation?.find(section =>
    section.links.find(link => link.href === location.pathname),
  );

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const Component = useMemo(() => getMDXComponent(code), [code]);
  return (
    <>
      <div className="min-w-0 max-w-2xl flex-auto border-l border-r border-dashed border-l-gray-800/20 border-r-gray-800/20 bg-white px-4 pb-16 pt-8 lg:max-w-none lg:border-l-0 lg:pl-8 lg:pr-0 xl:px-12">
        <article>
          {(title || section) && (
            <header className="mb-4 space-y-1">
              {section && (
                <p className="font-display text-sm font-medium text-blue-700">
                  {section.title}
                </p>
              )}
              {title && (
                <h1 className="font-display text-3xl font-medium tracking-tight text-black">
                  {title}
                </h1>
              )}
            </header>
          )}
          <Prose textSize="sm" className="!prose-p:text-slate-100">
            {code && (
              <Component
                components={{
                  Card,
                  Alert,
                  ExclamationTriangleIcon,
                  LinkButton,
                  DiscordIcon,
                  GridCard,
                  ExtLink,
                }}
              />
            )}
          </Prose>
        </article>
      </div>
      <div className="hidden pl-8 xl:sticky xl:top-[6.5rem] xl:-mr-6 xl:block xl:h-[calc(100vh-2rem)] xl:flex-none xl:overflow-y-auto xl:py-8 xl:pr-6">
        <TableOfContents tableOfContents={tableOfContents} />
      </div>
    </>
  );
}
