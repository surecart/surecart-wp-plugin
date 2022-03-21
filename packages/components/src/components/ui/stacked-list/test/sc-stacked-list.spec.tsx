import { newSpecPage } from '@stencil/core/testing';
import { ScStackedList } from '../sc-stacked-list';

describe('sc-stacked-list', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScStackedList],
      html: `<sc-stacked-list></sc-stacked-list>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
