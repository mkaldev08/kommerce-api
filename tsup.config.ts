import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: {
      server: "src/server.ts",
    },
    outDir: "build",
    format: ["esm"],
    bundle: true,
    splitting: false,
    minify: false,
    sourcemap: false,
    clean: true,
    target: "es2023",
    platform: "node",
    noExternal: [/.*/],
    shims: true,
    esbuildOptions(options) {
      options.banner = options.banner ?? {};
      options.banner.js = `${options.banner.js ?? ""}\nimport { createRequire } from \"module\";\nconst require = createRequire(import.meta.url);`;
    },
  },
  {
    entry: {
      seed: "src/scripts/seed-base-data.ts",
    },
    outDir: "build",
    format: ["esm"],
    bundle: false,
    splitting: false,
    minify: false,
    sourcemap: false,
    clean: false,
    target: "es2023",
    platform: "node",
  },
]);
