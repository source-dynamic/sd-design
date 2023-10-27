import type { StorybookConfig } from '@storybook/react-webpack5';
import custom from '../webpack.common.js';

const config: StorybookConfig = {
    stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-onboarding',
        '@storybook/addon-interactions'
    ],
    framework: {
        name: '@storybook/react-webpack5',
        options: {}
    },
    docs: {
        autodocs: 'tag',
        defaultName: '说明'
    },
    async webpackFinal(config, { configType }) {
        if (!config.module) {
            config.module = {
                rules: []
            };
        }
        if (!config.module.rules) {
            config.module.rules = [];
        }

        config.module.rules = config.module.rules.concat([
            {
                test: /\.scss$/i,
                use: [
                    'style-loader', // 这个loader取代style-loader。作用：提取js中的css成单独文件
                    'css-loader',
                    'sass-loader'
                ]
            },
        ]);
        return { ...config, resolve: { ...config.resolve, ...custom.resolve } };
    }
};
export default config;
