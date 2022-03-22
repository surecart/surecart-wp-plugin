import { newSpecPage } from '@stencil/core/testing';
import { ScCcLogo } from '../sc-cc-logo';

describe('sc-cc-logo', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScCcLogo],
      html: `<sc-cc-logo></sc-cc-logo>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
