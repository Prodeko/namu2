/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').options} */
const config = {
  plugins: [
    "prettier-plugin-tailwindcss",
    "@trivago/prettier-plugin-sort-imports",
  ],
  trailingComma: "all",
  singleQuote: false,
  semi: false,
  importOrder: ["^[A-Za-z]/(.*)$", "^@ui/(.*)$", "^@(.*)$", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};

export default config;
