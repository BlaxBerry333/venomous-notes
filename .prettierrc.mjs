/** @type {import("prettier").Config} */
const prettierConfig = {
  plugins: ["prettier-plugin-organize-imports", "prettier-plugin-organize-attributes", "prettier-plugin-css-order", "prettier-plugin-style-order", "prettier-plugin-tailwindcss"],

  printWidth: 160,
  singleQuote: false,
};

export default prettierConfig