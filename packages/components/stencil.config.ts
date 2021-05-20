import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';
import { sass } from '@stencil/sass';
import { readFileSync } from 'fs';

export const config: Config = {
  namespace: 'presto-components',
  globalStyle: './src/themes/base.css',
  devServer: {
    https: {
      cert: readFileSync('cert.pem', { encoding: 'utf-8' }),
      key: readFileSync('key.pem', { encoding: 'utf-8' }),
    },
  },
  testing: {
    transform: {
      '^.+\\.js': 'babel-jest',
    },
    transformIgnorePatterns: ['node_modules/(?!stencil-fragment)'],
  },
  outputTargets: [
    reactOutputTarget({
      componentCorePackage: '@presto-pay/components',
      proxiesFile: '../react/src/components/index.ts',
    }),
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements-bundle',
    },
    {
      type: 'docs-readme',
      dir: 'docs',
    },
    // {
    //   type: 'docs-json',
    // },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  plugins: [sass()],
};
