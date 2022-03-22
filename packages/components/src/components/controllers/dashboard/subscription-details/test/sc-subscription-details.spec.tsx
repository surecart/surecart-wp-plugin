import { newSpecPage } from '@stencil/core/testing';
import { ScSubscriptionDetails } from '../sc-subscription-details';

describe('sc-subscription-details', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScSubscriptionDetails],
      html: `<sc-subscription-details></sc-subscription-details>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
