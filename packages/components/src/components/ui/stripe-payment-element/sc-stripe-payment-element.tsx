import { Component, Element, Event, EventEmitter, h, Method, State, Watch } from '@stencil/core';
import { loadStripe } from '@stripe/stripe-js/pure';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { state as selectedProcessor } from '@store/selected-processor';

import { CustomStripeElementChangeEvent, FormStateSetter, PaymentInfoAddedParams, ShippingAddress } from '../../../types';
import { state as checkoutState, onChange } from '@store/checkout';
import { onChange as onChangeFormState } from '@store/form';
import { state as processorsState } from '@store/processors';
import { currentFormState } from '@store/form/getters';
import { createErrorNotice } from '@store/notices/mutations';
import { updateFormState } from '@store/form/mutations';
import { getCompleteAddress } from '@store/checkout/getters';
import { getProcessorByType } from '@store/processors/getters';

@Component({
  tag: 'sc-stripe-payment-element',
  styleUrl: 'sc-stripe-payment-element.scss',
  shadow: false,
})
export class ScStripePaymentElement {
  /** This element */
  @Element() el: HTMLScStripePaymentElementElement;

  /** Holds the element container. */
  private container: HTMLDivElement;

  /** holds the stripe element. */
  private element: any;

  private unlistenToFormState: () => void;
  private unlistenToCheckout: () => void;

  /** The error. */
  @State() error: string;

  /** Are we confirming the order? */
  @State() confirming: boolean = false;

  /** Are we initializing stripe? */
  @State() isInitializingStripe: boolean = false;

  /** Are we creating our updating stripe elements? */
  @State() isCreatingUpdatingStripeElement: boolean = false;

  /** Are we loaded? */
  @State() loaded: boolean = false;

  /** The order/invoice was paid for. */
  @Event() scPaid: EventEmitter<void>;

  /** Set the state */
  @Event() scSetState: EventEmitter<FormStateSetter>;

  /** Payment information was added */
  @Event() scPaymentInfoAdded: EventEmitter<PaymentInfoAddedParams>;

  @State() styles: CSSStyleDeclaration;

  async componentWillLoad() {
    this.fetchStyles();
    this.syncCheckoutMode();
  }

  @Watch('styles')
  async handleStylesChange() {
    this.createOrUpdateElements();
  }

  async fetchStyles() {
    this.styles = (await this.getComputedStyles()) as CSSStyleDeclaration;
  }

  /**
   * We wait for our property value to resolve (styles have been loaded)
   * This prevents the element appearance api being set before the styles are loaded.
   */
  getComputedStyles() {
    return new Promise(resolve => {
      let checkInterval = setInterval(() => {
        const styles = window.getComputedStyle(document.body);
        const color = styles.getPropertyValue('--sc-color-primary-500');
        if (color) {
          clearInterval(checkInterval);
          resolve(styles);
        }
      }, 100);
    });
  }

  /** Sync the checkout mode */
  async syncCheckoutMode() {
    onChange('checkout', () => {
      this.initializeStripe();
    });
  }

  async componentDidLoad() {
    this.initializeStripe();
  }

  async initializeStripe() {
    if (typeof checkoutState?.checkout?.live_mode === 'undefined' || processorsState?.instances?.stripe || this.isInitializingStripe) {
      return;
    }
    this.isInitializingStripe = true;
    const { processor_data } = getProcessorByType('stripe') || {};

    try {
      processorsState.instances.stripe = await loadStripe(processor_data?.publishable_key, { stripeAccount: processor_data?.account_id });
      this.error = '';
    } catch (e) {
      this.error = e?.message || __('Stripe could not be loaded', 'surecart');
      this.isInitializingStripe = false;
      // don't continue.
      return;
    }

    // create or update elements.
    this.createOrUpdateElements();
    this.handleUpdateElement();
    this.unlistenToCheckout = onChange('checkout', () => {
      this.fetchStyles();
      this.createOrUpdateElements();
      this.handleUpdateElement();
    });

    // we need to listen to the form state and pay when the form state enters the paying state.
    this.unlistenToFormState = onChangeFormState('formState', () => {
      if (!checkoutState?.checkout?.payment_method_required) return;
      if ('paying' === currentFormState()) {
        this.maybeConfirmOrder();
      }
    });
    this.isInitializingStripe = false;
  }

  clearStripeInstances() {
    this.isInitializingStripe = false;
    this.isCreatingUpdatingStripeElement = false;
    if (this?.element) {
      try {
        this.element?.unmount?.(); // If Stripe provides this method
      } catch (e) {
        console.warn('Could not unmount Stripe element:', e);
      }
      this.element = null;
    }
    if (processorsState?.instances?.stripeElements) {
      processorsState.instances.stripeElements = null;
    }
    if (processorsState?.instances?.stripe) {
      processorsState.instances.stripe = null;
    }
  }

  disconnectedCallback() {
    this.unlistenToFormState();
    this.unlistenToCheckout();
    this.clearStripeInstances();
  }

  getElementsConfig() {
    const styles = getComputedStyle(this.el);
    return {
      mode: checkoutState.checkout?.remaining_amount_due > 0 ? 'payment' : 'setup',
      amount: checkoutState.checkout?.remaining_amount_due,
      currency: checkoutState.checkout?.currency,
      setupFutureUsage: checkoutState.checkout?.reusable_payment_method_required ? 'off_session' : null,
      appearance: {
        variables: {
          colorPrimary: styles.getPropertyValue('--sc-color-primary-500') || 'black',
          colorText: styles.getPropertyValue('--sc-input-label-color') || 'black',
          borderRadius: styles.getPropertyValue('--sc-input-border-radius-medium') || '4px',
          colorBackground: styles.getPropertyValue('--sc-input-background-color') || 'white',
          fontSizeBase: styles.getPropertyValue('--sc-input-font-size-medium') || '16px',
          colorLogo: styles.getPropertyValue('--sc-stripe-color-logo') || 'light',
          colorLogoTab: styles.getPropertyValue('--sc-stripe-color-logo-tab') || 'light',
          colorLogoTabSelected: styles.getPropertyValue('--sc-stripe-color-logo-tab-selected') || 'light',
          colorTextPlaceholder: styles.getPropertyValue('--sc-input-placeholder-color') || 'black',
        },
        rules: {
          '.Input': {
            border: styles.getPropertyValue('--sc-input-border'),
          },
        },
      },
    };
  }

  maybeApplyFilters(options: any): any {
    if (!window?.wp?.hooks?.applyFilters) return options;

    return {
      ...options,
      paymentMethodOrder: window.wp.hooks.applyFilters('surecart_stripe_payment_element_payment_method_order', [], checkoutState.checkout),
      wallets: window.wp.hooks.applyFilters('surecart_stripe_payment_element_wallets', {}, checkoutState.checkout),
      terms: window.wp.hooks.applyFilters('surecart_stripe_payment_element_terms', {}, checkoutState.checkout),
      fields: window.wp.hooks.applyFilters('surecart_stripe_payment_element_fields', options.fields ?? {}),
    };
  }

  /** Update the payment element mode, amount and currency when it changes. */
  createOrUpdateElements() {
    // need an order amount, etc.
    if (!checkoutState?.checkout?.payment_method_required) return;
    if (!processorsState.instances.stripe || this.isCreatingUpdatingStripeElement) return;
    if (checkoutState.checkout?.status && ['paid', 'processing'].includes(checkoutState.checkout?.status)) return;

    this.isCreatingUpdatingStripeElement = true;

    // create the elements if they have not yet been created.
    if (!processorsState.instances.stripeElements) {
      // we have what we need, load elements.
      processorsState.instances.stripeElements = processorsState.instances.stripe.elements(this.getElementsConfig() as any);
      const { line1, line2, city, state, country, postal_code } = getCompleteAddress('shipping') ?? {};

      const options = this.maybeApplyFilters({
        defaultValues: {
          billingDetails: {
            name: checkoutState.checkout?.name,
            email: checkoutState.checkout?.email,
            ...(line1 && { address: { line1, line2, city, state, country, postal_code } }),
          },
        },
        fields: {
          billingDetails: {
            email: 'never',
          },
        },
      } as any);

      // create the payment element.
      (processorsState.instances.stripeElements as any).create('payment', options).mount(this.container);

      this.element = processorsState.instances.stripeElements.getElement('payment');
      this.element.on('ready', () => (this.loaded = true));
      this.element.on('change', (event: CustomStripeElementChangeEvent) => {
        const requiredShippingPaymentTypes = ['cashapp', 'klarna', 'clearpay'];
        checkoutState.paymentMethodRequiresShipping = requiredShippingPaymentTypes.includes(event?.value?.type);

        if (event.complete) {
          this.scPaymentInfoAdded.emit({
            checkout_id: checkoutState.checkout?.id,
            currency: checkoutState.checkout?.currency,
            processor_type: 'stripe',
            total_amount: checkoutState.checkout?.total_amount,
            line_items: checkoutState.checkout?.line_items,
            payment_method: {
              billing_details: {
                email: checkoutState.checkout?.email,
                name: checkoutState.checkout?.name,
              },
            },
          });
        }
      });
      this.isCreatingUpdatingStripeElement = false;
      return;
    }
    processorsState.instances.stripeElements.update(this.getElementsConfig());
    this.isCreatingUpdatingStripeElement = false;
  }

  /** Update the default attributes of the element when they cahnge. */
  handleUpdateElement() {
    if (!this.element) return;
    if (checkoutState.checkout?.status !== 'draft') return;

    const { name, email } = checkoutState.checkout;
    const { line_1: line1, line_2: line2, city, state, country, postal_code } = (checkoutState.checkout?.shipping_address as ShippingAddress) || {};

    const options = this.maybeApplyFilters({
      defaultValues: {
        billingDetails: {
          name,
          email,
          address: {
            line1,
            line2,
            city,
            state,
            country,
            postal_code,
          },
        },
      },
      fields: {
        billingDetails: {
          email: 'never',
        },
      },
    } as any);

    this.element.update(options);
  }

  async submit() {
    // this processor is not selected.
    if (selectedProcessor?.id !== 'stripe') return;
    // submit the elements.
    const { error } = await (processorsState.instances.stripeElements as any).submit();
    if (error) {
      console.error({ error });
      updateFormState('REJECT');
      createErrorNotice(error);
      this.error = error.message;
      return;
    }
  }

  /**
   * Watch order status and maybe confirm the order.
   */
  async maybeConfirmOrder() {
    // this processor is not selected.
    if (selectedProcessor?.id !== 'stripe') return;
    // must be a stripe session
    if (checkoutState.checkout?.payment_intent?.processor_type !== 'stripe') return;
    // need an external_type
    if (!checkoutState.checkout?.payment_intent?.processor_data?.stripe?.type) return;
    // we need a client secret.
    if (!checkoutState.checkout?.payment_intent?.processor_data?.stripe?.client_secret) return;
    // confirm the intent.
    return await this.confirm(checkoutState.checkout?.payment_intent?.processor_data?.stripe?.type);
  }

  @Method()
  async confirm(type, args = {}) {
    const confirmArgs = {
      elements: processorsState.instances.stripeElements,
      clientSecret: checkoutState.checkout?.payment_intent?.processor_data?.stripe?.client_secret,
      confirmParams: {
        return_url: addQueryArgs(window.location.href, {
          ...(checkoutState.checkout.id ? { checkout_id: checkoutState.checkout.id } : {}),
        }),
        payment_method_data: {
          billing_details: {
            email: checkoutState.checkout.email,
          },
        },
      },
      redirect: 'if_required',
      ...args,
    };

    // prevent possible double-charges
    if (this.confirming) return;

    // stripe must be loaded.
    if (!processorsState.instances.stripe) return;

    try {
      this.scSetState.emit('PAYING');
      const response =
        type === 'setup' ? await processorsState.instances.stripe.confirmSetup(confirmArgs as any) : await processorsState.instances.stripe.confirmPayment(confirmArgs as any);
      if (response?.error) {
        this.error = response.error.message;
        throw response.error;
      } else {
        this.scSetState.emit('PAID');
        // paid
        this.scPaid.emit();
      }
    } catch (e) {
      console.error(e);
      updateFormState('REJECT');
      createErrorNotice(e);
      if (e.message) {
        this.error = e.message;
      }
    } finally {
      this.confirming = false;
    }
  }

  render() {
    return (
      <div class="sc-stripe-payment-element" data-testid="stripe-payment-element">
        {!!this.error && (
          <sc-text
            style={{
              'color': 'var(--sc-color-danger-500)',
              '--font-size': 'var(--sc-font-size-small)',
              'marginBottom': '0.5em',
            }}
          >
            {this.error}
          </sc-text>
        )}

        <div class="loader" hidden={this.loaded}>
          <div class="loader__row">
            <div style={{ width: '50%' }}>
              <sc-skeleton style={{ width: '50%', marginBottom: '0.5em' }}></sc-skeleton>
              <sc-skeleton></sc-skeleton>
            </div>
            <div style={{ flex: '1' }}>
              <sc-skeleton style={{ width: '50%', marginBottom: '0.5em' }}></sc-skeleton>
              <sc-skeleton></sc-skeleton>
            </div>
            <div style={{ flex: '1' }}>
              <sc-skeleton style={{ width: '50%', marginBottom: '0.5em' }}></sc-skeleton>
              <sc-skeleton></sc-skeleton>
            </div>
          </div>
          <div class="loader__details">
            <sc-skeleton style={{ height: '1rem' }}></sc-skeleton>
            <sc-skeleton style={{ height: '1rem', width: '30%' }}></sc-skeleton>
          </div>
        </div>

        <div hidden={!this.loaded} class="sc-payment-element-container" ref={el => (this.container = el as HTMLDivElement)}></div>
      </div>
    );
  }
}
