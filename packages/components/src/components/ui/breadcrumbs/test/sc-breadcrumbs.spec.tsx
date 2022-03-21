import { newSpecPage } from '@stencil/core/testing';
import { ScBreadcrumbs } from '../sc-breadcrumbs';

describe('sc-breadcrumbs', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScBreadcrumbs],
      html: `<sc-breadcrumbs></sc-breadcrumbs>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
