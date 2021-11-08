import { newSpecPage } from '@stencil/core/testing';
import { CeLineItemsProvider } from '../ce-line-items-provider';

describe('ce-line-items-provider', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeLineItemsProvider],
      html: `<ce-line-items-provider></ce-line-items-provider>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
