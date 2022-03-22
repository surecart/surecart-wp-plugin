import { newSpecPage } from '@stencil/core/testing';
import { ScBreadcrumb } from '../sc-breadcrumb';

describe('sc-breadcrumb', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScBreadcrumb],
      html: `<sc-breadcrumb></sc-breadcrumb>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
