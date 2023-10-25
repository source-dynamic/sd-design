const path = require('path');

module.exports = {
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif)$/i,
                type: 'asset/inline'
            },
            {
                test: /\.svg$/,
                use: ['svg-inline-loader']
            },
            {
                test: /\.css$/i,
                use: [
                    'style-loader', // 这个loader取代style-loader。作用：提取js中的css成单独文件
                    'css-loader'
                ]
            },
            {
                test: /\.scss$/i,
                use: [
                    'style-loader', // 这个loader取代style-loader。作用：提取js中的css成单独文件
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
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
        extensions: ['.ts', '.js']
    }
};
