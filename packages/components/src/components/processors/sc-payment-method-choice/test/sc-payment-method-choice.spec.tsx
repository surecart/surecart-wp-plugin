import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { ScPaymentMethodChoice } from '../sc-payment-method-choice';
import { Checkout } from '../../../../types';

describe('sc-payment-method-choice', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScPaymentMethodChoice],
      html: `<sc-payment-method-choice></sc-payment-method-choice>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
