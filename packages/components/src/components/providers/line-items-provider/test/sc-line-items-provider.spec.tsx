import { newSpecPage } from '@stencil/core/testing';
import { ScLineItemsProvider } from '../sc-line-items-provider';

describe('sc-line-items-provider', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScLineItemsProvider],
      html: `<sc-line-items-provider></sc-line-items-provider>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
