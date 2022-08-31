module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    globals: {
        // jQuery is available to use in Webflow.
        $: 'readonly',
        // Segment analytics and Sentry globals are defined in the Webflow project's custom code.
        analytics: 'readonly',
        Sentry: 'readonly',
        // Additional globals that need to be set in the Webflow page's script.
        PAGE_NAME: 'readonly', // A string to include as the page name for Segment events.
        player: 'writable' // Initialize this as an empty variable.
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module'
    },
    rules: {
        'comma-dangle': ['error', 'never'],
        // From the official documentation, disable the main indent rule then enable the Typescript one.
        // @see https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/indent.md
        'indent': 'off',
        '@typescript-eslint/indent': ['error', 4, { 'SwitchCase': 1 }],
        'linebreak-style': ['error', 'unix'],
        // From the official documentation, disable the main no-unused-vars rule then enable the Typescript one.
        // @see https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/no-unused-vars.md
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
        'quotes': [2, 'single'],
        'semi': ['error', 'never'],
        'sort-imports': 'off',
        'no-var': 'error',
        // From the official documentation, disable the main no-use-before-define rule then enable the Typescript one.
        // @see https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/no-use-before-define.md#how-to-use
        'no-use-before-define': 'off',
        // Only function declarations are safely hoisted.
        // @see https://developer.mozilla.org/en-US/docs/Glossary/Hoisting
        '@typescript-eslint/no-use-before-define': ['error', { 'functions': false, 'classes': true, 'variables': true }]
    }
}