import { newSpecPage } from '@stencil/core/testing';
import { ScPaypalButtons } from '../paypal-buttons';

describe('paypal-buttons', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScPaypalButtons],
      html: `<sc-paypal-buttons></sc-paypal-buttons>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
