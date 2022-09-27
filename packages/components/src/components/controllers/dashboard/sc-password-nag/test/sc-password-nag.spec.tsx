import { newSpecPage } from '@stencil/core/testing';
import { ScPasswordNag } from '../sc-password-nag';

describe('sc-password-nag', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScPasswordNag],
      html: `<sc-password-nag></sc-password-nag>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
