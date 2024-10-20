import path, { join } from "path";

import * as fs from "fs/promises";
import { readdir } from "fs/promises";
import { existsSync, readFileSync } from "fs";
import { NotFoundResponse } from "~/services/errors.server";
import matter from "gray-matter";
import { parseMdx } from "~/services/mdx-bundler.server";

export const contentPath = join(process.cwd(), "content");

export const getLocalContent = async (path: string) => {
  try {
    if (!existsSync(join(contentPath, path))) throw new Error("No file found");

    const fullPath = join(contentPath, path);
    const data = readFileSync(fullPath, { encoding: "utf-8" });
    if (!data) throw new Error("No data found");
    return { content: data, slug: "/" + path.replace(".mdx", "") };
  } catch (error: any) {
    console.error(error);
    if (error.code?.includes("ENOENT")) {
      throw NotFoundResponse();
    }

    throw error;
  }
};

export const getAllBlogFiles = async () => {
  const sitePosts = await readdir(join(contentPath, "/blog"));
  const slugs = sitePosts.filter(path => path.endsWith(".mdx"));
  return await Promise.all(slugs.map(async slug => getLocalContent(`blog/${slug}`)));
};

type Link = { title: string; href: string; order?: number };
export type Section = { title: string; links: Link[] };

const convertToTitle = (str: string): string => {
  return str
    .replace(/-/g, " ")
    .replace(/and/g, "&")
    .replace(/\.md$/, "")
    .replace(/\.mdx$/, "")
    .replace(/\b\w/g, l => l.toUpperCase());
};

const getLinkOrder = async (content: string): Promise<number> => {
  const frontmatter = matter(content).data;
  return frontmatter.order || Infinity; // Default to a high number if 'order' is not specified
};

export const generateNavigationObject = async (): Promise<Section[]> => {
  const dir = join(contentPath, "docs");
  const navigation: Section[] = [];
  const items = await fs.readdir(dir, { withFileTypes: true });

  for (const item of items) {
    if (item.isDirectory()) {
      const sectionDir = join(dir, item.name);
      const files = await fs.readdir(sectionDir, { withFileTypes: true });
      const links: Link[] = [];

      for (const file of files) {
        if (file.isFile() && file.name.endsWith(".mdx")) {
          const filePath = join(sectionDir, file.name);
          const content = await fs.readFile(filePath, "utf8");

          const parsedPost = await parseMdx(content);
          const { title } = parsedPost.frontmatter;

          const order = await getLinkOrder(content);
          links.push({
            title: title || convertToTitle(file.name),
            href: `/${join("docs", item.name, path.parse(file.name).name).replace(
              /\\/g,
              "/",
            )}`,
            order,
          });
        }
      }

      // Sort links by 'order', then alphabetically
      links.sort((a, b) => {
        // Providing a default value if 'order' is undefined
        const orderA = a.order !== undefined ? a.order : Infinity;
        const orderB = b.order !== undefined ? b.order : Infinity;

        // First, compare by 'order', using the default value if necessary
        if (orderA !== orderB) {
          return orderA - orderB;
        }

        // If 'order' is the same or not specified, then sort alphabetically by title
        return a.title.localeCompare(b.title);
      });

      navigation.push({ title: convertToTitle(item.name), links });
    }
  }

  return navigation;
};
