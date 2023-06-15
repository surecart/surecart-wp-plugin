import { newSpecPage } from '@stencil/core/testing';
import { ScProvisionalBanner } from '../sc-provisional-banner';

describe('sc-provisional-banner', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScProvisionalBanner],
      html: `<sc-provisional-banner></sc-provisional-banner>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
