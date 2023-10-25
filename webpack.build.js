const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const CssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(common, {
    mode: 'production',
    entry: './src/index.ts',
    output: {
        clean: true,
        path: path.resolve(__dirname, 'lib'),
        filename: 'sdDesign.js',
        library: {
            name: 'sdDesign',
            type: 'umd'
        }
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    CssExtractPlugin.loader, // 这个loader取代style-loader。作用：提取js中的css成单独文件
                    'css-loader'
                ]
            },
            {
                test: /\.scss$/i,
                use: [
                    CssExtractPlugin.loader, // 这个loader取代style-loader。作用：提取js中的css成单独文件
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.xml$/i,
                use: 'raw-loader'
            },
            {
                test: /\.txt$/i,
                use: 'raw-loader'
            },
            { test: /\.ts$/, use: 'ts-loader' },
            { test: /\.js$/, use: 'babel-loader' }
        ]
    },
    plugins: [
        new CssExtractPlugin({
            filename: 'sdDesign.css'
        })
    ]
});
