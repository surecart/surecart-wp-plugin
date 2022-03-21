import { newSpecPage } from '@stencil/core/testing';
import { ScColumns } from '../sc-columns';

describe('sc-columns', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScColumns],
      html: `<sc-columns></sc-columns>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
