import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import alias from '@rollup/plugin-alias';
import svgo from 'rollup-plugin-svgo';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import strip from '@rollup/plugin-strip';

import path from 'path';

export default {
    input: 'src/index.ts',
    output: {
        file: 'dist/esm/sd-design.js',
        format: 'esm'
    },
    external: ['@odoo/owl'],
    plugins: [
        strip({
            include: [
                '**/*.(js|ts)'
            ]
        }),
        commonjs(),
        nodeResolve(),
        typescript({
            declaration: true,
            declarationDir: 'dist/esm/types'
        }),
        postcss({
            extract: 'css/index.css',
            extensions: ['.css', '.scss'],
            use: [
                ['sass', {
                    includePaths: [
                        path.resolve('.')
                    ]
                }]
            ]
        }),
        alias({
            resolve: ['.ts', '.js'], // 可选，默认情况下这只会查找 .js 文件或文件夹
            entries: {
                '@': path.resolve('./src')
            }
        }),
        svgo()
    ]
};
