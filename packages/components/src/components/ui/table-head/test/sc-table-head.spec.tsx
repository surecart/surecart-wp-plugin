import { newSpecPage } from '@stencil/core/testing';
import { ScTable } from '../sc-table-head';

describe('sc-table-head', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScTable],
      html: `<sc-table-head></sc-table-head>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
