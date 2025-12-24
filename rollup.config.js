import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import css from "rollup-plugin-css-only";
import copy from "rollup-plugin-copy";

const production = !process.env.ROLLUP_WATCH;

export default [
  // Content script bundle
  {
    input: "src/main.js",
    output: {
      sourcemap: !production,
      format: "iife",
      name: "app",
      file: "dist/content.js",
      inlineDynamicImports: true,  // ✅ Bundle all dynamic imports
    },
    plugins: [
      svelte({
        compilerOptions: {
          dev: !production,
        },
        emitCss: true,
      }),
      
      // Extract CSS to separate file
      css({ 
        output: "content.css" 
      }),
      
      resolve({
        browser: true,
        dedupe: ["svelte"],
        exportConditions: ["svelte"],
      }),
      
      commonjs(),
      
      production && terser(),
      
      // Copy static assets
      copy({
        targets: [
          { src: "manifest.json", dest: "dist" },
          { src: "icons/*", dest: "dist/icons" },
          // { src: "style.css", dest: "dist" },
        ],
      }),
    ],
    watch: {
      clearScreen: false,
    },
  },
];