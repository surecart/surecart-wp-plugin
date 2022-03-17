import { defineCustomElements } from '../loader';
defineCustomElements();

import '../src/themes/base.css';

import registerIcons from '../src/components/ui/icon/register';
registerIcons();

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
