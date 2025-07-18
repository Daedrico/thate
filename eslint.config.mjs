import globals from 'globals'

export default [{
  files: ['**/*.js'],
  languageOptions: {
    globals: {
      ...globals.commonjs,
      ...globals.node,
      ...globals.mocha,
    },

    ecmaVersion: 2022,
    sourceType: 'module',
  },
  rules: {
    'no-const-assign': 'warn',
    'no-this-before-super': 'warn',
    'no-undef': 'warn',
    'no-unreachable': 'warn',
    'no-unused-vars': 'warn',
    'no-multiple-empty-lines': ['error', { 'max': 1 }],
    'constructor-super': 'warn',
    'valid-typeof': 'warn',
    'indent': ['error', 2],
    'semi': ['error', 'never'],
    'comma-dangle': ['error', 'never'],
    'quotes': ['error', 'single']
  },
}]