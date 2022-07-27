import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { ScDonationChoices } from '../sc-donation-choices';
import { LineItem, Price } from '../../../../../types';

describe('sc-donation-choices', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScDonationChoices],
      template: () => <sc-donation-choices></sc-donation-choices>,
    });
    expect(page.root).toMatchSnapshot();
  });
});
