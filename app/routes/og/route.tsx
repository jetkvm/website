import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import path from "path";
import { promises as fs } from "fs";
import { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const jsonDirectory = path.join(process.cwd());

  // Read the json data file data.json
  const CircularBold = await fs.readFile(
    jsonDirectory + "/public/fonts/CircularXXWeb-Bold.woff",
  );
  const CircularMedium = await fs.readFile(
    jsonDirectory + "/public/fonts/CircularXXWeb-Medium.woff",
  );
  const CircularRegular = await fs.readFile(
    jsonDirectory + "/public/fonts/CircularXXWeb-Regular.woff",
  );

  const { searchParams } = new URL(request.url);
  const hasTitle = searchParams.has("title");
  const hasDescription = searchParams.has("description");

  if (!hasTitle && !hasDescription) {
    console.log("No title, description or product provided");
    throw new Error("No title, description or product provided");
  }

  const title = searchParams.get("title")?.slice(0, 100);
  const description = searchParams.get("description")?.slice(0, 100);

  const element = (
    <div
      // @ts-ignore
      tw="p-24"
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        fontFamily: "Circular",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "blue",
        backgroundImage: `url("https://jetkvm.com/bg.png")`,
        backgroundSize: "100% 100%",
        gap: "64px",
      }}
    >
      <div style={{ marginBottom: "16px", display: "flex" }}>
        <img src="https://jetkvm.com/logo.png" height={64} alt="" />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          // @ts-ignore
          tw="text-7xl max-w-3xl"
          style={{
            display: "flex",
            fontWeight: 700,
            color: "white",
            textAlign: "center",
            marginBottom: "16px",
          }}
        >
          {title}
        </div>
        <div
          // @ts-ignore
          tw="text-4xl"
          style={{
            display: "flex",
            marginBottom: "32px",
            color: "white",
            textAlign: "center",
            opacity: 0.8,
          }}
        >
          {description}
        </div>

        <div style={{ display: "flex", gap: "4px", flexDirection: "column" }}>
          <div
            style={{
              borderBottom: "4px solid rgba(255, 255, 255, 0.5)",
              display: "flex",
              width: "100%",
              height: "0",
            }}
          />
        </div>
      </div>
    </div>
  );

  const svg = await satori(element, {
    width: 1200,
    height: 630,
    embedFont: true,
    fonts: [
      {
        name: "Circular",
        data: CircularRegular,
        weight: 400,
        style: "normal",
      },
      {
        name: "Circular",
        data: CircularMedium,
        weight: 500,
        style: "normal",
      },
      {
        name: "Circular",
        data: CircularBold,
        style: "normal",
        weight: 700,
      },
    ],
  });

  const resvg = new Resvg(svg);
  const buffer = resvg.render().asPng();

  return new Response(buffer, {
    headers: {
      "content-type": "image/png",
      "cache-control":
        "public, immutable, no-transform, s-max-age=31536000, max-age=31536000",
    },
  });
}
