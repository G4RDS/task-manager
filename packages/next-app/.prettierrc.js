/** @type {import("prettier").Options} */
const config = {
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  trailingComma: 'all',
  semi: true,
  singleQuote: true,
  importOrder: ['^(next|react)', '<THIRD_PARTY_MODULES>', '^[./]'],
  importOrderSortSpecifiers: true,
};

export default config;
