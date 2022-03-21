import { newSpecPage } from '@stencil/core/testing';
import { ScSubscriptionCancel } from '../sc-subscription-cancel';

describe('sc-subscription-cancel', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScSubscriptionCancel],
      html: `<sc-subscription-cancel></sc-subscription-cancel>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
