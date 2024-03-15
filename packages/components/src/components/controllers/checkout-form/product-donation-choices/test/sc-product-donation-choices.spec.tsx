import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { ScProductDonationChoice } from '../sc-product-donation-choices';
import { __ } from '@wordpress/i18n';

describe('sc-product-donation-choices', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScProductDonationChoice],
      template: () => <sc-product-donation-choices></sc-product-donation-choices>,
    });
    expect(page.root).toMatchSnapshot();
  });
});
