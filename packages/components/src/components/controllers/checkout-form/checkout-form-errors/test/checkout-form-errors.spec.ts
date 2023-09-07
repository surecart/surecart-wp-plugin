import { newSpecPage } from '@stencil/core/testing';
import { ScCheckoutFormErrors } from '../sc-checkout-form-errors';
import { createErrorNotice } from '@store/notices/mutations';

describe('ScCheckoutFormErrors', () => {
  it('should render correctly with a error title and additional errors', async () => {
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

    expect(page.root).toMatchSnapshot();
  });
});
