import type { StorybookConfig } from '@storybook/react-webpack5';
import custom from './webpack.common.js';
import path from 'path';

const config: StorybookConfig = {
    stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-onboarding',
        '@storybook/addon-interactions',
        '@storybook/addon-actions'
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

        const fileLoaderRule: any = config.module.rules.find((rule: any) => rule.test.test('.svg'));
        fileLoaderRule.exclude = path.resolve(__dirname, '../src/assets'); // 使assets中的svg文件不走file-loader而走自定义的loader

        config.module.rules = config.module.rules.concat([
            {
                test: /\.scss$/i,
                use: [
                    'style-loader', // 这个loader取代style-loader。作用：提取js中的css成单独文件
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /web\.assets_web\.min\.css$/,
                use: 'raw-loader'
            },
            {
                test: /\.svg$/,
                use: ['svg-inline-loader']
            }
        ]);

        return {
            ...config,
            resolve: { ...config.resolve, ...custom.resolve }
        };
    }
};
export default config;
