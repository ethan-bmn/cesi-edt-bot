//@ts-check
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'

export default defineConfig({
  files: ['**/*.{js,ts}'],
  extends: [
    tseslint.configs.strict,
    tseslint.configs.stylistic,
  ],
  plugins: {
    '@stylistic': stylistic,
  },
  rules: {
    'markdown/heading-increment': 'off',
    '@stylistic/quotes': ['error', 'single'],
    'perfectionist/sort-imports': 'off',
    'no-console': 'off',
    '@stylistic/brace-style': ['error', '1tbs'],
    '@stylistic/semi': ['error', 'never'],
    'format/prettier': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn', // or "error"
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    'style/no-trailing-spaces': 'off',
  },
});