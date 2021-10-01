import { newSpecPage } from '@stencil/core/testing';
import { CeFormatNumber } from '../ce-format-number';

describe('ce-format-currency', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeFormatNumber],
      html: `<ce-format-number value="2000"></ce-format-number>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
