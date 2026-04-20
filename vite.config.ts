import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path, { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { transform } from "esbuild";
import terser from "@rollup/plugin-terser";
import { copyFileSync } from "fs";

// Compute __dirname for ES Modules:
const __dirname = dirname(fileURLToPath(import.meta.url));

// Optional custom minification plugin using esbuild
function minifyEs() {
  return {
    name: "minifyEs",
    renderChunk: {
      order: "post" as const,
      async handler(
        code: string,
        _chunk: any,
        outputOptions: { format: string },
      ) {
        if (outputOptions.format === "es") {
          const result = await transform(code, {
            minify: true,
            legalComments: "none",
          });

          return result.code;
        }

        return code;
      },
    },
  };
}

function copyDemoIndex() {
  return {
    name: "copy-demo-html",
    closeBundle() {
      copyFileSync("demo-index.html", "dist/index.html");
    }
  }
}

export default defineConfig(({ command }) => {
  if (command === "build") {
    return {
      plugins: [
        tailwindcss(),
        svelte({
          compilerOptions: {
            customElement: (id) => id.filename.endsWith(".wc.svelte"),
          },
        }),
        copyDemoIndex(),
        minifyEs(), // extra minification plugin using esbuild
        terser({
          compress: { pure_getters: true, unsafe: true, passes: 10 },
          mangle: true,
        }),
      ],

      build: {
        lib: {
          entry: resolve(__dirname, "src/wc/web-components.ts"),
          name: "SukusPatientVisitDocumentationApp",
          fileName: () => "sukus-patient-visit-documentation-app.js",
          formats: ["es"],
        },

        sourcemap: false,
        outDir: "dist",
      },

      resolve: {
        alias: {
          $lib: path.resolve("./src/lib"),
        },
      },
    };
  }

  // Development (dev server) configuration:
  return {
    plugins: [
      tailwindcss(),
      svelte({
        compilerOptions: {
          customElement: (id) => id.filename.endsWith(".wc.svelte"),
        },
      }),
    ],

    resolve: {
      alias: {
        $lib: path.resolve("./src/lib"),
      },
    },

    preview: { port: 4173, strictPort: false, host: true, open: true },
  };
});
