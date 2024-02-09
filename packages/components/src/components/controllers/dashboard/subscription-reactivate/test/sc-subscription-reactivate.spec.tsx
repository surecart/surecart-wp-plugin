import { newSpecPage } from '@stencil/core/testing';
import { ScSubscriptionReactivate } from '../sc-subscription-reactivate';
import { Subscription } from 'src/types';
import { h } from '@stencil/core';

describe('sc-subscription-reactivate', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScSubscriptionReactivate],
      html: `<sc-subscription-reactivate open></sc-subscription-reactivate>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('displays the correct subscription information', async () => {
    const page = await newSpecPage({
      components: [ScSubscriptionReactivate],
      template: () => (
        <sc-subscription-reactivate
          open
          subscription={{ id: 'test', current_period_end_at: 1696157610, price: { amount: 100 }, currency: 'USD' } as Subscription}
        ></sc-subscription-reactivate>
      ),
    });

    expect(page.root).toMatchSnapshot();
  });
});
