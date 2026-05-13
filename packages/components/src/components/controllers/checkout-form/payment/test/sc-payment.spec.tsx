import { newSpecPage } from '@stencil/core/testing';
import { ScPayment } from '../sc-payment';
import { dispose } from '@store/checkouts';
import { dispose as disposeSelectedProcessor } from '@store/selected-processor';
import { state as checkoutState, dispose as disposeCheckout } from '@store/checkout';
import { state as processorsState, dispose as disposeProcessors } from '@store/processors';
import { Checkout, Processor } from '../../../../../types';

beforeEach(() => {
  dispose();
  disposeSelectedProcessor();
  disposeProcessors();
  disposeCheckout();
});

describe('sc-payment', () => {
  it('renders no processors & user does not have `manage_sc_shop_settings` capability', async () => {
    const page = await newSpecPage({
      components: [ScPayment],
      html: `<sc-payment></sc-payment>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders no processors & user has `manage_sc_shop_settings` capability', async () => {
    // Set the mock attribute.
    global.window = Object.create(window);
    Object.defineProperty(window, 'scData', {
      value: {
        user_permissions: {
          manage_sc_shop_settings: true,
        },
        admin_url: 'https://test.com/',
      },
    });
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

  it('renders razorpay as a single combined tile on one-time checkouts', async () => {
    // Earlier tests may have defined scData non-configurably; mutate instead of redefining.
    if ((window as any).scData) {
      (window as any).scData.currency = 'inr';
    } else {
      Object.defineProperty(window, 'scData', { value: { currency: 'inr' }, configurable: true, writable: true });
    }

    const page = await newSpecPage({
      components: [ScPayment],
      html: `<sc-payment></sc-payment>`,
    });

    processorsState.processors = [
      {
        id: 'razorpayid',
        live_mode: true,
        recurring_enabled: true,
        processor_type: 'razorpay',
        supported_currencies: ['inr'],
      },
    ] as unknown as Processor[];
    // On one-time checkouts the provider clears methods; mirror that here.
    processorsState.methods = [];

    checkoutState.formId = 1;
    checkoutState.mode = 'live';
    checkoutState.checkout = {
      live_mode: true,
      currency: 'inr',
      reusable_payment_method_required: false,
    } as Checkout;

    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('renders razorpay as per-method tiles on recurring checkouts with multiple methods', async () => {
    // Earlier tests may have defined scData non-configurably; mutate instead of redefining.
    if ((window as any).scData) {
      (window as any).scData.currency = 'inr';
    } else {
      Object.defineProperty(window, 'scData', { value: { currency: 'inr' }, configurable: true, writable: true });
    }

    const page = await newSpecPage({
      components: [ScPayment],
      html: `<sc-payment></sc-payment>`,
    });

    processorsState.processors = [
      {
        id: 'razorpayid',
        live_mode: true,
        recurring_enabled: true,
        processor_type: 'razorpay',
        supported_currencies: ['inr'],
      },
    ] as unknown as Processor[];
    processorsState.methods = [
      { id: 'card' },
      { id: 'upi' },
    ] as any;

    checkoutState.formId = 1;
    checkoutState.mode = 'live';
    checkoutState.checkout = {
      live_mode: true,
      currency: 'inr',
      reusable_payment_method_required: true,
    } as Checkout;

    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('renders razorpay as per-method tile on recurring checkouts with a single method', async () => {
    // Earlier tests may have defined scData non-configurably; mutate instead of redefining.
    if ((window as any).scData) {
      (window as any).scData.currency = 'inr';
    } else {
      Object.defineProperty(window, 'scData', { value: { currency: 'inr' }, configurable: true, writable: true });
    }

    const page = await newSpecPage({
      components: [ScPayment],
      html: `<sc-payment></sc-payment>`,
    });

    processorsState.processors = [
      {
        id: 'razorpayid',
        live_mode: true,
        recurring_enabled: true,
        processor_type: 'razorpay',
        supported_currencies: ['inr'],
      },
    ] as unknown as Processor[];
    processorsState.methods = [{ id: 'card' }] as any;

    checkoutState.formId = 1;
    checkoutState.mode = 'live';
    checkoutState.checkout = {
      live_mode: true,
      currency: 'inr',
      reusable_payment_method_required: true,
    } as Checkout;

    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('renders mock processor with stripe', async () => {
    const page = await newSpecPage({
      components: [ScPayment],
      html: `<sc-payment></sc-payment>`,
    });

    processorsState.processors = [
      {
        id: 'stripeid',
        live_mode: false,
        recurring_enabled: true,
        processor_type: 'stripe',
      },
      {
        id: 'mockid',
        live_mode: false,
        recurring_enabled: true,
        processor_type: 'mock',
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
});
