import { ScCheckoutUnsavedChangesWarning } from '../sc-checkout-unsaved-changes-warning';
import { newSpecPage } from '@stencil/core/testing';

describe('checkout-unsaved-changes-warning', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScCheckoutUnsavedChangesWarning],
      html: `<sc-checkout-unsaved-changes-warning></sc-checkout-unsaved-changes-warning>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
