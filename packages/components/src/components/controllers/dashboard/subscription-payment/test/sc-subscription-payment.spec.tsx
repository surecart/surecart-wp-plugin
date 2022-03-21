import { newSpecPage } from '@stencil/core/testing';
import { ScSubscriptionPayment } from '../sc-subscription-payment';

describe('sc-subscription-payment', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScSubscriptionPayment],
      html: `<sc-subscription-payment></sc-subscription-payment>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
