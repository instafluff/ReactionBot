module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'global-require': 'off',
    'import/no-dynamic-require': 'off',
    'no-console': 'off',
    'prefer-destructuring': 'off',
    'no-return-await': 'off',
    'no-param-reassign': ['error', { props: false }],
  },
};
