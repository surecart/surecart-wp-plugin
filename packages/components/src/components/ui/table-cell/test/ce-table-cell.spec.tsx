import { newSpecPage } from '@stencil/core/testing';
import { CeTableCell } from '../ce-table-cell';

describe('ce-table-cell', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeTableCell],
      html: `<ce-table-cell></ce-table-cell>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
