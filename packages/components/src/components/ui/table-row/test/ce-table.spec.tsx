import { newSpecPage } from '@stencil/core/testing';
import { CeTableRow } from '../ce-table-row';

describe('ce-table', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeTableRow],
      html: `<ce-table-row></ce-table-row>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
