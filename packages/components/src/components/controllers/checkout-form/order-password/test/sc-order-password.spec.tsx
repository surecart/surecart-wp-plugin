import { h} from '@stencil/core';
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
  it('renders confirmation if provided', async () => {
    const page = await newSpecPage({
      components: [ScOrderPassword],
      template: () => <sc-order-password confirmation={true} confirmationLabel={'Label'} confirmationPlaceholder={'Placeholder'} confirmationHelp={"Help"}></sc-order-password>
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
  it('does not render if email exists', async () => {
    const page = await newSpecPage({
      components: [ScOrderPassword],
      html: `<sc-order-password email-exists></sc-order-password>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
