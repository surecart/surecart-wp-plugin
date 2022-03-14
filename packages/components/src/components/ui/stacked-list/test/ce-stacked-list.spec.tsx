import { newSpecPage } from '@stencil/core/testing';
import { CeStackedList } from '../ce-stacked-list';

describe('ce-stacked-list', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeStackedList],
      html: `<ce-stacked-list></ce-stacked-list>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
