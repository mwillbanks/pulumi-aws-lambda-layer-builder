import eslint from '@eslint/js';
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import prettierPlugin from "eslint-plugin-prettier";
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    files: ["**/*.ts", "**/*.md", "**/*.json"],
    ignores: ['dist', 'node_modules'],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    language: "markdown/gfm",
    plugins: {
      markdown: markdown,
    },
    config: markdown.configs.recommended,
  },
  {
    language: "json/json",
    plugins: {
      json: json,
    },
    config: json.configs.recommended,
  },
  {
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
    },
    config: prettierPlugin.configs.recommended,
  },
);
