import { newSpecPage } from '@stencil/core/testing';
import { CeSubscriptionSwitch } from '../ce-subscription-switch';

describe('ce-subscription-switch', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeSubscriptionSwitch],
      html: `<ce-subscription-switch></ce-subscription-switch>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
