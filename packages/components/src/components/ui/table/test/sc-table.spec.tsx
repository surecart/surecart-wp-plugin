import { newSpecPage } from '@stencil/core/testing';
import { ScTable } from '../sc-table';

describe('sc-table', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScTable],
      html: `<sc-table></sc-table>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
