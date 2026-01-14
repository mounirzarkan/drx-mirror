const babelParser = require('@babel/eslint-parser');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const globals = require('globals');

module.exports = [
  {
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false,
          presets: ['@babel/preset-env']
        }
      },
      ecmaVersion: 9,
      globals: {
        ...globals.node,
        mocha: true
      }
    },
    ignores: [
      'node_modules/',
      '.serverless/',
      '/serverless-plugin',
      '/*.swp',
      '.history',
      '.nyc_output/',
      '_optimize/',
      '_warmup/',
      'coverage/',
      'variables.json',
      '**/variables-*.json'
    ],
    rules: {
      semi: 'error',
      'prefer-const': 'error',
      'no-unused-vars': 'error',
      'prettier/prettier': 'error'
    }
  },
  eslintPluginPrettierRecommended
];
