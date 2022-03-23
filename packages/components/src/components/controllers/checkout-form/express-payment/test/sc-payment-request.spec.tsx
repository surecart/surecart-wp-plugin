import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { ScExpressPayment } from '../sc-express-payment';

describe('sc-express-payment', () => {
  it('renders empty', async () => {
    const page = await newSpecPage({
      components: [ScExpressPayment],
      html: `<sc-express-payment></sc-express-payment>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders express payment if there are payment options', async () => {
    const page = await newSpecPage({
      components: [ScExpressPayment],
      template: () => (
        <sc-express-payment
          has-payment-options
          order={
            {
              processor_data: {
                stripe: {
                  publishable_key: 'pk_test_12345',
                  account_id: 'acct_12345',
                },
              },
            } as any
          }
        ></sc-express-payment>
      ),
    });
    expect(page.root).toMatchSnapshot();
  });
});
