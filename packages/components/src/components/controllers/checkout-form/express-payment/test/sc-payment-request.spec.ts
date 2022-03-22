import { newSpecPage } from '@stencil/core/testing';
import { ScExpressPayment } from '../sc-express-payment';

describe('sc-express-payment', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScExpressPayment],
      html: `<sc-express-payment></sc-express-payment>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
