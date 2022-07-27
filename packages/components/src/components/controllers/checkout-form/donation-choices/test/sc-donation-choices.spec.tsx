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

  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScDonationChoices],
      template: () => (
        <sc-donation-choices priceId={'test_price'}>
          <sc-choice value="100">$1</sc-choice>
          <sc-choice value="500">$5</sc-choice>
          <sc-choice value="1000">$10</sc-choice>
          <sc-choice value="1500">$15</sc-choice>
          <sc-choice value="ad_hoc">Other</sc-choice>
        </sc-donation-choices>
      ),
    });

    page.waitForChanges();

    page.root.lineItems = [
      {
        id: 'line',
        ad_hoc_amount: 1000,
        price: {
          id: 'test_price',
          ad_hoc_min_amount: 500,
          ad_hoc_max_amount: 1000,
        } as Price,
      } as LineItem,
    ];

    page.waitForChanges();

    expect(page.root).toMatchSnapshot();
  });
});
