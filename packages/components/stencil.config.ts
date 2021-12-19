import { Config } from '@stencil/core';
import { promises as fs } from 'fs';
import { JsonDocs } from '@stencil/core/internal';
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
      '^.+\\.(ts|tsx|js|jsx|css)$': '@stencil/core/testing/jest-preprocessor',
    },
    transformIgnorePatterns: ['node_modules/(?!stencil-fragment)'],
    // setupFilesAfterEnv: ['./src/test/setup-tests.js'],
  },
  outputTargets: [
    reactOutputTarget({
      componentCorePackage: '@checkout-engine/components',
      proxiesFile: '../integrations/react/src/components/index.ts',
      includeDefineCustomElements: false,
    }),
    {
      type: 'dist',
    },
    {
      type: 'dist-custom-elements-bundle',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
    {
      // this generates a json file to be used for kses functions.
      type: 'docs-custom',
      generator: async (docs: JsonDocs) => {
        const components = docs.components;
        const out = {};
        components.forEach(component => {
          const initialValue = {};
          const props = component.props.reduce((obj, item) => {
            return {
              ...obj,
              [item.name.replace(/[A-Z]/g, m => '-' + m.toLowerCase())]: true,
            };
          }, initialValue);
          out[component.tag] = {
            ...props,
            style: true,
            class: true,
            slot: true,
          };
        });
        // return docs;
        // Custom logic goes here
        await fs.writeFile('./kses.json', JSON.stringify(out, null, 2));
      },
    },
  ],
  plugins: [sass()],
};
