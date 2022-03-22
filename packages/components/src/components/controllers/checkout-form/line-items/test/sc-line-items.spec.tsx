import { newSpecPage } from '@stencil/core/testing';
import { ScLineItems } from '../sc-line-items';

describe('sc-line-items', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScLineItems],
      html: `<sc-line-items></sc-line-items>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
