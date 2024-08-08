import { defineConfig } from 'rollup';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import alias from '@rollup/plugin-alias';
import path from 'node:path';

export default defineConfig({
	input: './src/index.ts',
	output: {
		file: './dist/index.js',
		format: 'cjs',
	},
	plugins: [
		nodeResolve({
			exportConditions: ['node']
		}),
		commonjs(),
		json(),
		typescript({
			tsconfig: 'tsconfig.json',
			declaration: false,
		}),
		alias({
			entries: [
				{
					find: '@',
					replacement: path.resolve(__dirname, './src')
				}
			]
		})
	],
});