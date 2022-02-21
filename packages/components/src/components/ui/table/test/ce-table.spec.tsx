import { newSpecPage } from '@stencil/core/testing';
import { CeTable } from '../ce-table';

describe('ce-table', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeTable],
      html: `<ce-table></ce-table>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
