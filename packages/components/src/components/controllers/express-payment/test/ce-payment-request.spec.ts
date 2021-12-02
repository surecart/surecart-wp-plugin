import { newSpecPage } from '@stencil/core/testing';
import { CeExpressPayment } from '../ce-express-payment';

describe('ce-express-payment', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeExpressPayment],
      html: `<ce-express-payment></ce-express-payment>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
