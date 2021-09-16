import { newSpecPage } from '@stencil/core/testing';
import { CePaymentRequest } from '../ce-payment-request';

describe('ce-payment-request', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CePaymentRequest],
      html: `<ce-payment-request></ce-payment-request>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
