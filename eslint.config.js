const globals = require('globals');
const eslint = require('@eslint/js');
const typescriptEslint = require('typescript-eslint');
const typescriptEslintParser = require('@typescript-eslint/parser');
const typescriptEslintPlugin = require('@typescript-eslint/eslint-plugin');
const prettierEslintConfig = require('eslint-config-prettier');
const prettierEslintPlugin = require('eslint-plugin-prettier');
const prettierEslintPluginRecommended = require('eslint-plugin-prettier/recommended');
const importEslintPlugin = require('eslint-plugin-import');

module.exports = typescriptEslint.config(
  eslint.configs.recommended,
  ...typescriptEslint.configs.strictTypeChecked,
  ...typescriptEslint.configs.stylisticTypeChecked,
  prettierEslintConfig,
  prettierEslintPluginRecommended,
  {
    name: 'default eslint config',
    files: ['src/**/*.ts'],
    ignores: ['dist', 'node_modules'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parser: typescriptEslintParser,
      parserOptions: {
        ecmaVersion: 'latest',
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
      prettier: prettierEslintPlugin,
      import: importEslintPlugin,
    },
    rules: {
      'sort-imports': [
        'error',
        {
          allowSeparatedGroups: false,
          ignoreCase: false,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        },
      ],
      '@typescript-eslint/consistent-return': 'error',
      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/consistent-type-definitions': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/member-ordering': 'error',
      '@typescript-eslint/naming-convention': [
        'warn',
        {
          selector: 'enumMember',
          format: ['UPPER_CASE'],
        },
      ],
      '@typescript-eslint/no-empty-interface': 'off',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          'newlines-between': 'never',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },
);
