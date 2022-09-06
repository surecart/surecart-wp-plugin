import * as i18n from '@wordpress/i18n';
window.wp = {
  i18n,
};

import { defineCustomElements } from '../loader';
defineCustomElements();

window.registerSureCartIconPath('https://cdn.jsdelivr.net/npm/@surecart/components/dist/surecart/icon-assets');

import '../src/themes/base.css';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
