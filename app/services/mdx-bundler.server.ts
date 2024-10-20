import { bundleMDX } from "mdx-bundler";
import rehypeSlug from "rehype-slug";
import rehypePrism from "rehype-prism-plus";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";

export async function parseMdx(mdx: string) {
  const { frontmatter, code } = await bundleMDX({
    source: mdx,
    mdxOptions(options) {
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        [rehypeSlug],
        [
          rehypeAutolinkHeadings,
          {
            behavior: "wrap",
            properties: { className: ["anchor"] },
          },
        ],
        [rehypePrism, { showLineNumbers: true }],
        remarkGfm,
      ];
      return options;
    },
  });

  return {
    frontmatter,
    code,
  };
}
