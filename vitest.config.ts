import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { installGlobals } from "@remix-run/node";
import envOnly from "vite-env-only";

installGlobals();

export default defineConfig({
  server: { port: 3000 },
  plugins: [envOnly(), tsconfigPaths()],

  test: {
    globals: true,
    pool: "forks",
    include: ["tests/**/*.test.ts"],
  },
});
