// Minimal flat config for this repository. Avoids importing internal ESLint
// package internals so it works with a standard install.
module.exports = [
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      '.vscode/',
      '*.min.js',
      'lunr/*.json',
      'v2/service-worker.js',
      'archive/'
    ]
  },

  // project JS rules and language options
  {
    files: ['src/**/*.js', '*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module'
    },
    rules: {
      // keep rules minimal and non-opinionated for now
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off'
    }
  }
];