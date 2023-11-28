/** @type {import("eslint").Linter.Config} */
const config = {
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  plugins: [
    // "eslint-plugin-tsdoc",
    "@typescript-eslint",
  ],
  parserOptions: {
    project: "./tsconfig.json",
    ecmaFeatures: {
      jsx: true,
    },
  },
  ignorePatterns: "./**/*.js",
  overrides: [
    // This is here so we don't use typescript parser for js files.
    {
      files: ["**/*.js", "**/*.jsx"],
      parserOptions: {
        project: null,
      },
    },
  ],
  root: true,
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/function-component-definition": "off",
    "react/prop-types": "off",
    "import/prefer-default-export": "off",
    "react/jsx-props-no-spreading": "off",
    // "tsdoc/syntax": "warn",
    "@typescript-eslint/no-unused-vars": [
      "warn", // or "error"
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
  },
  settings: {
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
    react: {
      version: "detect", // Detected react version automatically
    },
  },
};

module.exports = config;
