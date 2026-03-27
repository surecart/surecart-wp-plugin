import { newSpecPage } from '@stencil/core/testing';
import { ScLicense } from '../sc-license';

describe('sc-license', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScLicense],
      html: `<sc-license></sc-license>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
