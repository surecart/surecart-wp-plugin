import { newSpecPage } from '@stencil/core/testing';
import { ScLineItemTotal } from '../sc-line-item-total';

describe('sc-line-item-total', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScLineItemTotal],
      html: `<sc-line-item-total></sc-line-item-total>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
