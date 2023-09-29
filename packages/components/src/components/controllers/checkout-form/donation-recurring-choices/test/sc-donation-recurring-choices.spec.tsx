import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { ScDonationRecurringChoices } from '../sc-donation-recurring-choices';
import { Price } from '../../../../../types';
import { __ } from '@wordpress/i18n';

describe('sc-donation-recurring-choices', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScDonationRecurringChoices],
      template: () => <sc-donation-recurring-choices></sc-donation-recurring-choices>,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('It should render the recurring & non recurring Price choices with the Labels', async function () {
    const page = await newSpecPage({
      components: [ScDonationRecurringChoices],
      template: () => 
      <sc-donation-recurring-choices
        label={__('Make it Recurring', 'surecart')}
        recurringChoiceLabel={__('Yes, Count me in!', 'surecart')}
        nonRecurringChoiceLabel={__('No, Thanks', 'surecart')}
        prices={[
          {
            id: '1',
            name: 'Monthly',
            recurring_interval: 'month',
            recurring_interval_count: 3,
            ad_hoc: true,
            amount: 2900,
            currency: 'usd',
          },
          {
            id: '2',
            name: 'Yearly',
            recurring_interval: 'year',
            recurring_interval_count: 2,
            ad_hoc: true,
            amount: 20000,
            currency: 'usd',
          },
          {
            id: '3',
            name: 'Weekly',
            recurring_interval: 'week',
            recurring_interval_count: 12,
            ad_hoc: false,
            amount: 1200,
            currency: 'usd',
          },
          {
            id: '4',
            name: 'Daily',
            recurring_interval: 'day',
            recurring_interval_count: 24,
            ad_hoc: false,
            amount: 800,
            currency: 'usd',
          },
        ] as Price[]}
        priceId="1"
        part='recurring-choices'
      >
      </sc-donation-recurring-choices>
    });
    expect(page.root).toMatchSnapshot();
  });
  
});
