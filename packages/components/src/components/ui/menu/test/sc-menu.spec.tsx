import { ScMenu } from '../sc-menu';
import { newSpecPage } from '@stencil/core/testing';

describe('sc-menu', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScMenu],
      html: `<sc-menu></sc-menu>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
