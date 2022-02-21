import { newSpecPage } from '@stencil/core/testing';
import { CeTable } from '../ce-table-head';

describe('ce-table-head', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeTable],
      html: `<ce-table-head></ce-table-head>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
