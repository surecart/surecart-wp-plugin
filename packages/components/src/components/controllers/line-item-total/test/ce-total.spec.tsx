import { newSpecPage } from '@stencil/core/testing';
import { CeLineItemTotal } from '../ce-line-item-total';

describe('ce-line-item-total', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeLineItemTotal],
      html: `<ce-line-item-total></ce-line-item-total>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
