// Import ESLint core JavaScript rules
import js from '@eslint/js';
// Import predefined global variables for different environments
import globals from 'globals';
// Import React Hooks linting plugin
import reactHooks from 'eslint-plugin-react-hooks';
// Import React Refresh linting plugin for development hot reloading
import reactRefresh from 'eslint-plugin-react-refresh';
// Import TypeScript ESLint configuration utilities
import tseslint from 'typescript-eslint';

// Export ESLint configuration using TypeScript ESLint config helper
export default tseslint.config(
  // Ignore the dist directory from linting
  { ignores: ['dist'] },
  {
    // Extend recommended configurations for JavaScript and TypeScript
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    // Apply this configuration to TypeScript and TSX files
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      // Set ECMAScript version to 2020
      ecmaVersion: 2020,
      // Use browser environment globals
      globals: globals.browser,
    },
    plugins: {
      // Register React Hooks plugin
      'react-hooks': reactHooks,
      // Register React Refresh plugin
      'react-refresh': reactRefresh,
    },
    rules: {
      // Apply all recommended React Hooks rules
      ...reactHooks.configs.recommended.rules,
      // Warn when components export non-component values (allows constant exports)
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  }
);