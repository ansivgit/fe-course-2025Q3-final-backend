import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  eslintPluginUnicorn.configs.recommended,

  {
    files: ['**/*.{ts,js}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {},
    linterOptions: {
      noInlineConfig: true,
    },
    rules: {
      // 🔴 Mandatory
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        { accessibility: 'explicit', overrides: { constructors: 'off' } },
      ],
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'off', //* switched off for now
      '@typescript-eslint/no-unsafe-call': 'off', //* switched off for now

      // 🟡 Good practices
      'no-console': ['warn', { allow: ['info', 'error'] }],
      'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
      'max-lines-per-function': ['warn', { max: 60, skipBlankLines: true }],
      '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'never' }],
      '@typescript-eslint/consistent-type-definitions': ['warn', 'type'],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
        },
      ],
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/await-thenable': 'warn',

      'unicorn/prevent-abbreviations': [
        'error',
        {
          replacements: {
            args: false,
            db: false,
            err: false,
            err_msg: false,
            index: false,
            msg: false,
            temp: false,
            params: false,
            props: false,
            ref: false,
            res: false,
            req: false,
          },
        },
      ],
      'unicorn/prefer-node-protocol': 'error',
      'unicorn/prefer-top-level-await': 'warn',
      'unicorn/prefer-export-from': ['error', {'ignoreUsedVariables': true}],

      // 🎨 Styles
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],
      curly: ['error', 'all'],
      indent: ['error', 2, { SwitchCase: 1 }],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],
      'brace-style': [
        'error',
        '1tbs',
        {
          allowSingleLine: false,
        },
      ],
      'arrow-parens': ['error', 'always'],
      'max-len': ['warn', { code: 120, ignoreComments: true }],

      // 🔧 Switched off
      'no-magic-numbers': ['off'],
      'unicorn/no-array-reduce': 'off',
      'unicorn/no-array-for-each': 'off',
      'unicorn/no-null': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/number-literal-case': 'off',
      'unicorn/numeric-separators-style': 'off',
      '@typescript-eslint/no-misused-promises': 'off', //* switched off for now
      '@typescript-eslint/restrict-template-expressions': 'off', //* switched off for now
      '@typescript-eslint/no-inferrable-types': 'error',
    },
  },
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/*.d.ts',
      'eslint.config.js',
      'lint-staged.config.js',
    ],
  },
]);
