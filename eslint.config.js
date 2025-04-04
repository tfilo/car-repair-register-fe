import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import reactCompiler from 'eslint-plugin-react-compiler';
import tseslint from 'typescript-eslint';
import pluginQuery from '@tanstack/eslint-plugin-query';

export default [
    ...pluginQuery.configs['flat/recommended'],
    ...tseslint.config(
        { ignores: ['dist', 'src/api/openapi', 'src/routeTree.gen.ts', 'openapi'] },
        {
            extends: [js.configs.recommended, ...tseslint.configs.recommended],
            files: ['**/*.{ts,tsx}'],
            languageOptions: {
                ecmaVersion: 2020,
                globals: globals.browser
            },
            plugins: {
                'react-hooks': reactHooks,
                'react-refresh': reactRefresh,
                'react-compiler': reactCompiler
            },
            rules: {
                ...reactHooks.configs.recommended.rules,
                'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
                'react-compiler/react-compiler': 'error'
            }
        }
    )
];
