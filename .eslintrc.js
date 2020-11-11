const RULES = {
  OFF: 0,
  WARN: 1,
};
module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ["airbnb-base", "prettier"],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    quotes: RULES.OFF,
    "no-underscore-dangle": RULES.OFF,
    "no-undef": RULES.OFF,
    "global-require": RULES.OFF,
    "class-methods-use-this": RULES.OFF,
    "no-console": RULES.OFF,
    "import/no-dynamic-require": RULES.OFF,
    "func-names": RULES.OFF,
    "no-useless-escape": RULES.OFF,
    "consistent-return": RULES.OFF,
    "import/no-extraneous-dependencies": RULES.OFF,
  },
};
