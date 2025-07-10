import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";

export default defineConfig([
  // General JS files
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.node, // ✅ Add Node.js globals
        ...globals.es2021
      },
    },
    plugins: { js },
    rules: {
      // Add custom rules if needed
    },
  },

  // React-specific config
  pluginReact.configs.flat.recommended,
]);