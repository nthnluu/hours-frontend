const path = require('path');

const toPath = (filePath) => path.join(process.cwd(), filePath);

module.exports = {
    "webpackFinal": async config => {
        return {
            ...config,
            resolve: {
                ...config.resolve,
                modules: [...config.resolve.modules, path.resolve(__dirname, '../src')],
                alias: {
                    ...config.resolve.alias,
                    '@emotion/core': toPath('node_modules/@emotion/react'),
                    'emotion-theming': toPath('node_modules/@emotion/react'),
                },
            },
        };
    },
    "stories": [
        "../src/**/*.stories.mdx",
        "../src/**/*.stories.@(js|jsx|ts|tsx)"
    ],
    "addons": [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
    ]
};

