import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import url from '@rollup/plugin-url';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import svgrImport from '@svgr/rollup';
const svgr = svgrImport.default || svgrImport;
import { compileAsync } from 'sass'; // Dart Sass

// Use createRequire to import package.json
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const pkg = require('./package.json');

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    }
  ],
  plugins: [
    external(),
    postcss({
      extensions: ['.css', '.scss'],
      extract: 'styles.css',
      minimize: true,
      preprocessor: async (content, id) => {
        const result = await compileAsync(id);
        return { code: result.css };
      }
    }),
    url(),
    svgr(),
    babel({
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
      extensions: ['.js', '.jsx']
    }),
    resolve(),
    commonjs()
  ]
};
