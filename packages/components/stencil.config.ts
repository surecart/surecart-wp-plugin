import { Config } from '@stencil/core';
import { generateMarkdown } from '@stencil/core/src/compiler/docs/readme/output-docs.ts';
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
    // {
    //   type: 'docs-readme',
    //   footer: 'test 1'
    // },
    // {
    //   type: 'docs-custom',
    //   generator: (docs) => {
    //     docs.components.forEach((doc) => {
    //       generateMarkdown('test', doc, docs, {type: 'docs-readme' });
    //     });
    //   }
    // },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  plugins: [sass()],
};
