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

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function replaceExportsPlugin(replacement) {
    return {
        name: 'replace-exports',
        renderChunk(code) {
            let newCode = code;
            const target = '({}, this.owl);';
            if (endsWith(code.trim(), target)) {
                // 获取原始字符串的长度
                const originalLength = code.length;
                // 计算替换后的新字符串
                newCode = code.slice(0, originalLength - target.length) + `(${replacement}, this.owl);`;
            }

            return {
                code: newCode,
                map: null // 如果不处理 source map，可以返回 null
            };
        }
    };
}

export default {
    input: 'src/index.ts',
    output: {
        file: 'dist/esm/sd-design.js',
        format: 'iife',
        globals: {
            '@odoo/owl': 'this.owl'
        }
    },
    external: ['@odoo/owl'],
    plugins: [
        replaceExportsPlugin('this.sdDesign = this.sdDesign || {}'),
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
