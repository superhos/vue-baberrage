import vue from 'rollup-plugin-vue'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import {
  terser
} from "rollup-plugin-terser"

export default [{
    input: "./src/lib/index.js",
    output: {
      name: "vue-baberrage",
      file: "./dist/vue-baberrage.js",
      format: "umd",
    },
    extensions: ['.js', '.jsx', '.vue', '.json'],
    // ...
    plugins: [
      // ...
      resolve({
        browser: true,
      }),
      terser(),
      commonjs(),
      babel({
        exclude: 'node_modules/**' // 排除node_modules 下的文件
      }),
      vue( /* options */ ),
    ],
  },
  // SSR build.
  {
    input: "./src/lib/index.js",
    output: {
      format: 'cjs',
      file: "./dist/vue-baberrage.ssr.js"
    },
    extensions: ['.js', '.jsx', '.vue', '.json'],
    plugins: [
      commonjs(),
      terser(),
      babel({
        exclude: 'node_modules/**' // 排除node_modules 下的文件
      }),
      resolve(),
      vue({
        template: {
          optimizeSSR: true
        }
      })
    ]
  }
]
