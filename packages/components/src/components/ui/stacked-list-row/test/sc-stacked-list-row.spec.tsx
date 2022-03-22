import { newSpecPage } from '@stencil/core/testing';
import { ScStackedListRow } from '../sc-stacked-list-row';

describe('sc-stacked-list-row', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScStackedListRow],
      html: `<sc-stacked-list-row></sc-stacked-list-row>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
