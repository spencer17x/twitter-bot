import { defineConfig } from 'rollup';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';

export default defineConfig({
	input: './src/index.ts',
	output: {
		file: './dist/index.js',
		format: 'cjs',
	},
	plugins: [
		nodeResolve({
			preferBuiltins: true
		}),
		commonjs(),
		json(),
		typescript({
			tsconfig: 'tsconfig.json',
		}),
	],
});