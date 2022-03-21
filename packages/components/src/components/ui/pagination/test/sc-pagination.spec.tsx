import { newSpecPage } from '@stencil/core/testing';
import { ScPagination } from '../sc-pagination';

describe('sc-pagination', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScPagination],
      html: `<sc-pagination></sc-pagination>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
