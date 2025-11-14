import { defineConfig, mergeConfig } from 'vitest/config';
import { nestConfig } from '@repo/vitest-config';
import { resolve } from 'path';
import swc from 'unplugin-swc';

export default defineConfig(
  mergeConfig(nestConfig, {
    plugins: [swc.vite()],
    resolve: {
      alias: {
        '@tasks': resolve(__dirname, './src/tasks'),
        '@links': resolve(__dirname, './src/links'),
        '@database': resolve(__dirname, './src/database'),
        '@common': resolve(__dirname, './src/common'),
        '@src': resolve(__dirname, './src'),
      },
    },
  }),
);
