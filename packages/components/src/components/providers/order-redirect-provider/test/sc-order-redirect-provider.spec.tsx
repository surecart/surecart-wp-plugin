import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { ScOrderRedirectProvider } from '../sc-order-redirect-provider';

describe('sc-order-redirect-provider', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScOrderRedirectProvider],
      html: `<sc-order-redirect-provider></sc-order-redirect-provider>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
