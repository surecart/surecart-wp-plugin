import { newSpecPage } from '@stencil/core/testing';
import { ScEmpty } from '../sc-empty';

describe('sc-empty', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScEmpty],
      html: `<sc-empty></sc-empty>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
