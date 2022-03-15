import { newSpecPage } from '@stencil/core/testing';
import { CeOrderPassword } from '../ce-order-password';

describe('ce-order-password', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeOrderPassword],
      html: `<ce-order-password></ce-order-password>`,
    });
    expect(page.root).toMatchSnapshot();
  });
  it('does not render if logged in', async () => {
    const page = await newSpecPage({
      components: [CeOrderPassword],
      html: `<ce-order-password logged-in></ce-order-password>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
