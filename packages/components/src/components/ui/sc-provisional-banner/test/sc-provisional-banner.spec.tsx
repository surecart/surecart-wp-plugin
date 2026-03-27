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

  it('renders with expired prop true', async () => {
    const page = await newSpecPage({
      components: [ScProvisionalBanner],
      html: `<sc-provisional-banner expired="true"></sc-provisional-banner>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders with expired prop false', async () => {
    const page = await newSpecPage({
      components: [ScProvisionalBanner],
      html: `<sc-provisional-banner expired="false"></sc-provisional-banner>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
