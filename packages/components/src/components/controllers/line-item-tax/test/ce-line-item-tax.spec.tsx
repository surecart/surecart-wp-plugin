import { newSpecPage } from '@stencil/core/testing';
import { CeLineItemTax } from '../ce-line-item-tax';

describe('ce-line-item-tax', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeLineItemTax],
      html: `<ce-line-item-tax></ce-line-item-tax>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
