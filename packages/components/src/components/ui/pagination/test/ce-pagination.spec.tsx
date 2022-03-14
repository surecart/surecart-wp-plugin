import { newSpecPage } from '@stencil/core/testing';
import { CePagination } from '../ce-pagination';

describe('ce-pagination', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CePagination],
      html: `<ce-pagination></ce-pagination>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
