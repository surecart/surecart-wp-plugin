import { newSpecPage } from '@stencil/core/testing';
import { ScSubscriptionSwitch } from '../sc-subscription-switch';

describe('sc-subscription-switch', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScSubscriptionSwitch],
      html: `<sc-subscription-switch></sc-subscription-switch>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
