const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
    mode: 'development',
    entry: './test/index.js',
    devtool: 'source-map',
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './test/index.html')
        })],
    devServer: {
        allowedHosts: 'all',
        compress: true,
        port: 9000,
        proxy: {
            '/test': {
                target: '配置代理地址',
                pathRewrite: { '^/test': '' }
            }
        }
    }
});
