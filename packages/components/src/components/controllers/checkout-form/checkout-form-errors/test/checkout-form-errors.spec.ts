import { newSpecPage } from '@stencil/core/testing';
import { ScCheckoutFormErrors } from '../sc-checkout-form-errors';
import { createErrorNotice } from '@store/notices/mutations';
import { updateFormState } from '@store/form/mutations';

describe('ScCheckoutFormErrors', () => {
  it('should render errors', async () => {
    // Create a mock error notice with additional errors.
    createErrorNotice(
      {
        code: 'test',
        message: 'Error title',
        additional_errors: [
          {
            code: 'test2',
            message: 'Additional error 1',
          },
          {
            code: 'test3',
            message: 'Additional error 2',
          },
        ],
      },
      {
        dismissible: true,
      },
    );

    const page = await newSpecPage({
      components: [ScCheckoutFormErrors],
      html: `<sc-checkout-form-errors></sc-checkout-form-errors>`,
    });

    expect(page.root).toMatchSnapshot('initial errors');

    // make sure it removes if fetching.
    updateFormState('FETCH');
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot('cleared due to fetching.');

    // Resolve the update.
    updateFormState('RESOLVE');
    createErrorNotice(
      {
        code: 'test',
        message: 'Error title',
        additional_errors: [
          {
            code: 'test2',
            message: 'Additional error 1',
          },
          {
            code: 'test3',
            message: 'Additional error 2',
          },
        ],
      },
      {
        dismissible: true,
      },
    );

    await page.waitForChanges();
    expect(page.root).toMatchSnapshot('re-added errors after clearing.');

    updateFormState('FINALIZE');
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot('cleared due to finalizing.');
  });
});
