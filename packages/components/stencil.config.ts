import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';
import { sass } from '@stencil/sass';
import { readFileSync } from 'fs';

export const config: Config = {
  namespace: 'checkout-engine',
  globalStyle: './src/themes/base.css',
  devServer: {
    https: {
      cert: readFileSync('cert.pem', { encoding: 'utf-8' }),
      key: readFileSync('key.pem', { encoding: 'utf-8' }),
    },
  },
  testing: {
    // browserHeadless: false,
    transform: {
      '^.+\\.js': 'babel-jest',
    },
    transformIgnorePatterns: ['node_modules/(?!stencil-fragment)'],
    // setupFilesAfterEnv: ['./src/test/setup-tests.js'],
  },
  outputTargets: [
    reactOutputTarget({
      componentCorePackage: '@checkout-engine/components',
      proxiesFile: '../integrations/react/src/components/index.ts',
    }),
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements-bundle',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  plugins: [sass()],
};
