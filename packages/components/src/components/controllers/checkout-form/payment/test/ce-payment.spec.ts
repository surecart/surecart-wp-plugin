import { newSpecPage } from '@stencil/core/testing';
import { CePayment } from '../ce-payment';

describe('ce-payment', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CePayment],
      html: `<ce-payment></ce-payment>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
