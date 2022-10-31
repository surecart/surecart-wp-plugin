import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { ScOrderConfirmComponentsValidator } from '../sc-order-confirm-components-validator';
import { Checkout } from '../../../../types';

describe('sc-order-confirm-components-validator', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScOrderConfirmComponentsValidator],
      html: `<sc-order-confirm-components-validator></sc-order-confirm-components-validator>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
