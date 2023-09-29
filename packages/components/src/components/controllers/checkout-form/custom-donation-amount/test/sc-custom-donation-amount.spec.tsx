import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { ScCustomDonationAmount } from '../sc-custom-donation-amount';
import { __ } from '@wordpress/i18n';

describe('sc-custom-donation-amount', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScCustomDonationAmount],
      template: () => <sc-custom-donation-amount></sc-custom-donation-amount>,
    });
    expect(page.root).toMatchSnapshot();
  });
});
