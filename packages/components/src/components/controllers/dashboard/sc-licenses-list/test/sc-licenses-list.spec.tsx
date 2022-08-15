import { ScLicensesList } from '../sc-licenses-list';
import { newSpecPage } from '@stencil/core/testing';

describe('sc-licenses-list', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScLicensesList],
      html: `<sc-licenses-list></sc-licenses-list>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
