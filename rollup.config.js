import { defineConfig } from 'rollup';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import typescript from 'rollup-plugin-typescript2';

export default defineConfig(async () => {
    const { default: externals } = await import('rollup-plugin-node-externals');

    return [
        {
            input: {
                index: 'src/index.ts', // 入口文件
            },
            output: [
                {
                    dir: 'dist', // 输出目录
                    format: 'cjs', // 输出commonjs文件
                },
            ],
            plugins: [
                nodeResolve(),
                externals({
                    devDeps: false, // 可以识别 package.json 中的 devDependencies 依赖 当做外部依赖
                }),
                typescript(),
                json(),
                commonjs(),
                terser(),
            ],
        },
    ];
});