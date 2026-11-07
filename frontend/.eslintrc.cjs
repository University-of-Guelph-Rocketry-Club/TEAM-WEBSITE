module.exports = {
  root: true,
  env: { browser: true, es2022: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended'
  ],
  ignorePatterns: ['dist', 'node_modules', 'public'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: 'detect' } },
  plugins: ['react-refresh'],
  rules: {
    // We don't use PropTypes anywhere.
    'react/prop-types': 'off',
    // Apostrophes and quotes in JSX text render fine.
    'react/no-unescaped-entities': 'off',
    // React 18 passes this through to the <img> as long as it's lowercase.
    'react/no-unknown-property': ['error', { ignore: ['fetchpriority'] }],
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }]
  },
  overrides: [
    {
      files: ['*.config.js', '.eslintrc.cjs'],
      env: { node: true }
    }
  ]
}
