import { newSpecPage } from '@stencil/core/testing';
import { CeFormatDate } from '../ce-format-date';

describe('ce-format-date', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeFormatDate],
      template: () => <ce-format-date></ce-format-date>,
    });
    expect(page.root).toMatchSnapshot();
  });
});
