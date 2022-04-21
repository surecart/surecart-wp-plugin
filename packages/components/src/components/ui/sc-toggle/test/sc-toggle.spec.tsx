import { newSpecPage } from '@stencil/core/testing';
import { ScToggle } from '../sc-toggle';

describe('sc-toggle', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScToggle],
      html: `<sc-toggle></sc-toggle>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
