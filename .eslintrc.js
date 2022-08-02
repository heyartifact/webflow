module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true
    },
    extends: [
        'eslint:recommended'
    ],
    globals: {
        // jQuery is available to use in Webflow.
        $: 'readonly',
        // Segment globals are defined in the Webflow project's custom code.
        analytics: 'readonly',
        // Additional globals that need to be set in the Webflow page's script.
        PAGE_NAME: 'readonly', // A string to include as the page name for Segment events.
        PLAYER: 'writable' // Initialize this as an empty variable.
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module'
    },
    rules: {
        'comma-dangle': ['error', 'never'],
        'indent': ['error', 4, { 'SwitchCase': 1 }],
        'linebreak-style': ['error', 'unix'],
        'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
        'quotes': [2, 'single'],
        'semi': ['error', 'never'],
        'sort-imports': 'off',
        'no-var': 'error',
        // Only function declarations are safely hoisted.
        // @see https://developer.mozilla.org/en-US/docs/Glossary/Hoisting
        'no-use-before-define': ['error', { 'functions': false, 'classes': true, 'variables': true }]
    }
}