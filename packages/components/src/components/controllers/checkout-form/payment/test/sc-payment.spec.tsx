import { newSpecPage } from '@stencil/core/testing';
import { ScPayment } from '../sc-payment';

describe('sc-payment', () => {
  it('renders no processors', async () => {
    const page = await newSpecPage({
      components: [ScPayment],
      html: `<sc-payment></sc-payment>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
