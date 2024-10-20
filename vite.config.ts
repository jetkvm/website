import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { installGlobals } from "@remix-run/node";
import envOnly from "vite-env-only";

installGlobals();

export default defineConfig({
  server: { port: 3000 },
  plugins: [envOnly(), remix({ ignoredRouteFiles: ["**/*.css"] }), tsconfigPaths()],
});
