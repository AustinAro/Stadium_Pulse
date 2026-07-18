import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        WebSocket: 'readonly',
        AudioContext: 'readonly',
        webkitAudioContext: 'readonly',
        Blob: 'readonly',
        URL: 'readonly',
        self: 'readonly',
        crypto: 'readonly'
      }
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    rules: {
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'no-unused-vars': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
