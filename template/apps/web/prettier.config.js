/** @type {import("prettier").Config} */
const config = {
  // Basic formatting
  useTabs: false,
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',
  printWidth: 100,
  endOfLine: 'lf',

  // Plugin configuration
  plugins: [
    'prettier-plugin-svelte',
    'prettier-plugin-tailwindcss', // Must be last
  ],

  // Svelte-specific overrides
  overrides: [
    {
      files: '*.svelte',
      options: {
        parser: 'svelte',
      },
    },
  ],

  // Svelte formatting options
  svelteStrictMode: false,
  svelteAllowShorthand: true,
  svelteIndentScriptAndStyle: true,
};

export default config;
