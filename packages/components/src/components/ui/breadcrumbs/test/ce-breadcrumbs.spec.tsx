import { newSpecPage } from '@stencil/core/testing';
import { CeBreadcrumbs } from '../ce-breadcrumbs';

describe('ce-breadcrumbs', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeBreadcrumbs],
      html: `<ce-breadcrumbs></ce-breadcrumbs>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
