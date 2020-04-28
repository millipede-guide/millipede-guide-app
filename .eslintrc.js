module.exports = {
    extends: [
        // https://prettier.io/docs/en/integrating-with-linters.html
        'standard',
        'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
        'airbnb',
        'prettier',
        'prettier/react',
    ],
    // parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
        allowImportExportEverywhere: true, // Trying to fix "Parsing error: Unexpected token import"
        ecmaFeatures: {
            jsx: true, // Allows for the parsing of JSX
        },
    },
    env: {
        es6: true,
        browser: true,
        node: true,
    },
    rules: {
        // 'max-len': ['error', { code: 1000 }],
        indent: ['error', 4],
        // semi: ['error', 'always'],
        // 'no-unused-vars': 'off',
        // 'comma-dangle': [
        //     'error',
        //     {
        //         arrays: 'always-multiline',
        //         objects: 'always-multiline',
        //         imports: 'always-multiline',
        //         exports: 'always-multiline',
        //         functions: 'always-multiline',
        //     },
        // ],
        // 'import/no-extraneous-dependencies': [
        //     'error',
        //     {
        //         devDependencies: true,
        //     },
        // ],
        'react/prop-types': 'off',
        'react/require-default-props': 'off',
        'react/react-in-jsx-scope': 'off',
        // 'react/jsx-indent': ['error', 4],
        // 'react/jsx-indent-props': ['error', 4],
        'react/jsx-props-no-spreading': 'off',
        'jsx-a11y/anchor-is-valid': 'off',
        // 'react/jsx-one-expression-per-line': ['off'],
        // 'react/jsx-filename-extension': [
        //     1,
        //     {
        //         extensions: ['.js', '.jsx', '.ts', '.tsx'],
        //     },
        // ],
        // 'react-hooks/rules-of-hooks': 'error',
        'import/no-named-as-default': 'off',
        'import/no-named-as-default-member': 'off',
        // 'react-hooks/exhaustive-deps': 'off',
        // 'jsx-a11y/anchor-is-valid': [
        //     'error',
        //     {
        //         components: ['Link'],
        //         specialLink: ['hrefLeft', 'hrefRight'],
        //         aspects: ['invalidHref', 'preferButton'],
        //     },
        // ],
    },
    plugins: ['babel', 'import', 'prettier', 'react', 'react-hooks', 'standard'],
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
        react: {
            version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
        },
    },
};
