import { Config } from '@stencil/core';
import { promises as fs, readFileSync } from 'fs';
import { JsonDocs } from '@stencil/core/internal';
import externalGlobals from 'rollup-plugin-external-globals';
import { reactOutputTarget } from '@stencil/react-output-target';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'surecart',
  globalStyle: './src/themes/base.css',
  globalScript: './src/global/global.ts',
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
    setupFilesAfterEnv: ['./setup-tests.js'],
  },
  outputTargets: [
    reactOutputTarget({
      componentCorePackage: '@surecart/components',
      proxiesFile: '../components-react/src/components/index.ts',
      includeDefineCustomElements: true,
    }),
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
      autoDefineCustomElements: true,
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
            id: true,
            class: true,
            slot: true,
          };
        });
        await fs.writeFile('./docs/kses.json', JSON.stringify(out, null, 2));
      },
    },
  ],
  plugins: [
    sass(),
    externalGlobals({
      // '@wordpress/api-fetch': 'wp.apiFetch',
      // '@wordpress/hooks': 'wp.hooks',
      '@wordpress/i18n': 'wp.i18n',
      // '@wordpress/url': 'wp.url',
      'wp': 'wp',
    }),
  ],
};
