module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    "airbnb-base",
    'plugin:@typescript-eslint/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    "class-methods-use-this": "off",
    "import/extensions": "off",
    "import/prefer-default-export": "off",
    "import/no-unresolved": "off",
    "import/no-extraneous-dependencies": "off",
    "indent": [
        "error",
        4
    ],
    "linebreak-style": "off",
    "max-len": "off",
    "no-console": ["error", {
        "allow": ["warn", "error", "info"]
    }],
    "no-empty-function": ["error", { "allow": ["constructors"] }],
    "no-useless-constructor": "off",
  },
};
