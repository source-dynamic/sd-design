import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import alias from '@rollup/plugin-alias';
import svgo from 'rollup-plugin-svgo';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import strip from '@rollup/plugin-strip';
import replace from '@rollup/plugin-replace';
import fs from 'fs';

import path from 'path';

const packageJson = JSON.parse(fs.readFileSync(path.resolve('./package.json'), 'utf-8'));

export default {
    input: 'src/index.ts',
    output: {
        dir: 'dist/es',
        format: 'es',
    },
    external: ['@odoo/owl'],
    plugins: [
        replace({
            preventAssignment: true,
            'window.__OWL_VERSION__': `'${packageJson.version}'`,
            'window.__BUILD_DATE__': `'${new Date().toISOString()}'`
        }),
        strip({
            include: [
                '**/*.(js|ts)'
            ]
        }),
        commonjs(),
        nodeResolve(),
        typescript({
            declaration: true
        }),
        postcss({
            extract: 'css/sd-design.css',
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
