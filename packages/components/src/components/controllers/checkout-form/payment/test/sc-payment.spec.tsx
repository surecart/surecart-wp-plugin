import { newSpecPage } from '@stencil/core/testing';
import { ScPayment } from '../sc-payment';
import store from '@store/checkouts';
import { dispose as disposeSelectedProcessor } from '@store/selected-processor';
import { state as checkoutState, dispose as disposeCheckout } from '@store/checkout';
import { state as processorsState, dispose as disposeProcessors } from '@store/processors';
import { Checkout, Processor } from '../../../../../types';

beforeEach(() => {
  store.dispose();
  disposeSelectedProcessor();
  disposeProcessors();
  disposeCheckout();
});

describe('sc-payment', () => {
  it('renders no processors', async () => {
    const page = await newSpecPage({
      components: [ScPayment],
      html: `<sc-payment></sc-payment>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders stripe and paypal with no checkout', async () => {
    const page = await newSpecPage({
      components: [ScPayment],
      html: `<sc-payment></sc-payment>`,
    });

    processorsState.processors = [
      {
        live_mode: true,
        recurring_enabled: true,
        processor_type: 'stripe',
      },
      {
        live_mode: true,
        recurring_enabled: false,
        processor_type: 'paypal',
      },
    ] as Processor[];

    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('only renders processors with the right mode', async () => {
    const page = await newSpecPage({
      components: [ScPayment],
      html: `<sc-payment></sc-payment>`,
    });

    processorsState.processors = [
      {
        live_mode: true,
        recurring_enabled: true,
        processor_type: 'stripe',
      },
      {
        live_mode: false,
        recurring_enabled: false,
        processor_type: 'paypal',
      },
    ] as Processor[];

    checkoutState.formId = 1;
    checkoutState.mode = 'test';
    checkoutState.checkout = {
      live_mode: false,
    } as Checkout;

    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('does not render non-recurring if recurring is required', async () => {
    const page = await newSpecPage({
      components: [ScPayment],
      html: `<sc-payment></sc-payment>`,
    });

    processorsState.processors = [
      {
        live_mode: false,
        recurring_enabled: true,
        processor_type: 'stripe',
      },
      {
        live_mode: false,
        recurring_enabled: false,
        processor_type: 'paypal',
      },
    ] as Processor[];

    checkoutState.formId = 1;
    checkoutState.mode = 'test';
    checkoutState.checkout = {
      live_mode: false,
      reusable_payment_method_required: true,
    } as Checkout;

    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('only renders only mollie component if mollie is active', async () => {
    const page = await newSpecPage({
      components: [ScPayment],
      html: `<sc-payment></sc-payment>`,
    });

    processorsState.processors = [
      {
        id: 'mollieid',
        live_mode: true,
        recurring_enabled: true,
        processor_type: 'mollie',
      },
      {
        live_mode: true,
        recurring_enabled: true,
        processor_type: 'stripe',
      },
      {
        live_mode: true,
        recurring_enabled: false,
        processor_type: 'paypal',
      },
    ] as Processor[];

    checkoutState.formId = 1;
    checkoutState.mode = 'live';
    checkoutState.checkout = {
      live_mode: true,
    } as Checkout;

    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });
});
