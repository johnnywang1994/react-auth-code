// https://tsup.egoist.sh/
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm', 'iife'],
  globalName: 'ReactAuthCode',
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: true,
  external: ['react']
})