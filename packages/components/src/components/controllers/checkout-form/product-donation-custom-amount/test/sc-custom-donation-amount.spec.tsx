import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { ScProductDonationCustomAmount } from '../sc-product-donation-custom-amount';
import { __ } from '@wordpress/i18n';

describe('sc-product-donation-custom-amount', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScProductDonationCustomAmount],
      template: () => <sc-product-donation-custom-amount></sc-product-donation-custom-amount>,
    });
    expect(page.root).toMatchSnapshot();
  });
});
