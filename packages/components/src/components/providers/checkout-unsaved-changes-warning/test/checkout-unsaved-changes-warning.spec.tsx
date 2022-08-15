import { CheckoutUnsavedChangesWarning } from '../sc-checkout-unsaved-changes-warning';
import { newSpecPage } from '@stencil/core/testing';

describe('checkout-unsaved-changes-warning', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CheckoutUnsavedChangesWarning],
      html: `<checkout-unsaved-changes-warning></checkout-unsaved-changes-warning>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
