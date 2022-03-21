import { newSpecPage } from '@stencil/core/testing';
import { ScOrderPassword } from '../sc-order-password';

describe('sc-order-password', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScOrderPassword],
      html: `<sc-order-password></sc-order-password>`,
    });
    expect(page.root).toMatchSnapshot();
  });
  it('does not render if logged in', async () => {
    const page = await newSpecPage({
      components: [ScOrderPassword],
      html: `<sc-order-password logged-in></sc-order-password>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
