import { newSpecPage } from '@stencil/core/testing';
import { ScTotal } from '../sc-total';

describe('sc-total', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScTotal],
      html: `<sc-total></sc-total>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
