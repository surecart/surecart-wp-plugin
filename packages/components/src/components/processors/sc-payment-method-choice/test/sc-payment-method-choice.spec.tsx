import { newSpecPage } from '@stencil/core/testing';
import { h} from '@stencil/core';
import { ScPaymentMethodChoice } from '../sc-payment-method-choice';
import { Checkout } from '../../../../types';

describe('sc-payment-method-choice', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScPaymentMethodChoice],
      html: `<sc-payment-method-choice></sc-payment-method-choice>`,
    });
    expect(page.root).toMatchSnapshot();
  });
  it('Renders toggle if it has others', async () => {
    const page = await newSpecPage({
      components: [ScPaymentMethodChoice],
      html: `<sc-payment-method-choice has-others></sc-payment-method-choice>`,
    });
    expect(page.root).toMatchSnapshot();
  });
  it('Does not display if disabled', async () => {
    const page = await newSpecPage({
      components: [ScPaymentMethodChoice],
      template:  () => <sc-payment-method-choice recurring-enabled={false}></sc-payment-method-choice>
    });
    page.root.checkout = ({reusable_payment_method_required: true}) as Checkout;
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });
  it('Is selected (and open) if the processor matches the processor id', async () => {
    const page = await newSpecPage({
      components: [ScPaymentMethodChoice],
      template:  () => <sc-payment-method-choice processorId="test" hasOthers></sc-payment-method-choice>
    });
    page.root.processor = 'test';
    expect(page.root).toMatchSnapshot();
  });
});
