import { Component, Element, Event, EventEmitter, h, Listen, Method, Prop, Watch } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { getQueryArg, getQueryArgs, removeQueryArgs } from '@wordpress/url';
import { parseFormData } from '../../../functions/form-data';
import { clearOrder, getOrder, setOrder } from '../../../store/checkouts';

import { createOrUpdateOrder, finalizeSession, fetchCheckout } from '../../../services/session';
import { FormStateSetter, PaymentIntents, ProcessorName, LineItemData, PriceChoice, Checkout } from '../../../types';

@Component({
  tag: 'sc-session-provider',
  shadow: true,
})
export class ScSessionProvider {
  /** Element */
  @Element() el: HTMLElement;

  /** Group id */
  @Prop() groupId: string;

  /** Are we in test or live mode. */
  @Prop() mode: 'test' | 'live' = 'live';

  /** The checkout form id */
  @Prop() formId: number;

  /** Whent the post was modified. */
  @Prop() modified: string;

  /** An array of prices to pre-fill in the form. */
  @Prop() prices: Array<PriceChoice> = [];

  /** Currency Code */
  @Prop() currencyCode: string = 'usd';

  /** Should we persist the session. */
  @Prop() persist: boolean = true;

  /** Set the checkout state */
  @Prop() setState: (state: string) => void;

  /** The processor. */
  @Prop() processor: ProcessorName = 'stripe';

  /** Url to redirect upon success. */
  @Prop() successUrl: string;

  /** Holds all available payment intents. */
  @Prop() paymentIntents: PaymentIntents;

  /** Are we using the Stripe payment element? */
  @Prop() stripePaymentElement: boolean;

  /** Update line items event */
  @Event() scUpdateOrderState: EventEmitter<Checkout>;

  /** Update line items event */
  @Event() scUpdateDraftState: EventEmitter<Checkout>;

  @Event() scPaid: EventEmitter<void>;

  /** Error event */
  @Event() scError: EventEmitter<{ message: string; code?: string; data?: any; additional_errors?: any } | {}>;

  /** Set the state */
  @Event() scSetState: EventEmitter<FormStateSetter>;

  @Listen('scUpdateOrder')
  handleUpdateSession(e) {
    const { data, options } = e.detail;
    if (options?.silent) {
      this.update(data);
    } else {
      this.loadUpdate(data);
    }
  }

  @Watch('prices')
  handlePricesChange() {
    let line_items = this.addInitialPrices() || [];
    line_items = this.addPriceChoices(line_items);
    if (!line_items?.length) {
      return;
    }
    return this.loadUpdate({ line_items });
  }

  /**
   * Finalize the order.
   *
   * @returns {Promise<Order>}
   */
  @Method()
  async finalize() {
    return await this.handleFormSubmit();
  }

  /** Get the order from the store. */
  order() {
    return getOrder(this?.formId, this.mode) as Checkout;
  }

  getProcessor() {
    switch (this.processor) {
      case 'paypal':
      case 'paypal-card':
        return 'paypal';
      default:
        return 'stripe';
    }
  }

  async getFormData() {
    let data = {};
    const form = this.el.querySelector('sc-form');
    if (form) {
      const json = await form.getFormJson();
      data = parseFormData(json);
    }
    return data;
  }

  /**
   * Handles the form submission.
   * @param e
   */
  @Listen('scFormSubmit')
  async handleFormSubmit() {
    this.scError.emit({});

    this.scSetState.emit('FINALIZE');

    // Get current form state.
    let data = this.getFormData();

    if (window?.scData?.recaptcha_site_key && window?.grecaptcha) {
      try {
        data['grecaptcha'] = await window.grecaptcha.execute(window.scData.recaptcha_site_key, { action: 'surecart_checkout_submit' });
      } catch (e) {
        console.error(e);
        this.scSetState.emit('REJECT');
        this.handleErrorResponse(e);
        return;
      }
    }

    // first lets make sure the session is updated before we process it.
    try {
      await this.update(data);
    } catch (e) {
      console.error(e);
      this.scSetState.emit('REJECT');
      this.handleErrorResponse(e);
    }

    // first validate server-side and get key
    try {
      const order = await finalizeSession({
        id: this.order()?.id,
        data,
        query: {
          ...this.defaultFormQuery(),
        },
        processor: this.getProcessor(),
      });

      setOrder(order, this.formId);

      // the order is paid
      if (order?.status === 'paid') {
        this.scPaid.emit();
      }

      setTimeout(() => {
        this.scSetState.emit('PAYING');
      }, 50);

      return this.order();
    } catch (e) {
      console.error(e);
      this.handleErrorResponse(e);
    }
  }

  /**
   * Handle paid event and update the
   */
  @Listen('scPaid')
  async handlePaid() {
    this.scSetState.emit('PAID');
  }

  @Listen('scPayError')
  async handlePayError() {
    this.scSetState.emit('REJECT');
  }

  /** Handles coupon updates. */
  @Listen('scApplyCoupon')
  async handleCouponApply(e) {
    const promotion_code = e.detail;
    this.scError.emit({});
    this.loadUpdate({
      discount: {
        ...(promotion_code ? { promotion_code } : {}),
      },
    });
  }

  /** Find or create session on load. */
  componentDidLoad() {
    this.findOrCreateOrder();
  }

  /** Find or create an order */
  async findOrCreateOrder() {
    // get URL params.
    const { redirect_status, checkout_id, line_items, coupon } = getQueryArgs(window.location.href);
    // remove params we don't want.
    window.history.replaceState({}, document.title, removeQueryArgs(window.location.href, 'redirect_status', 'coupon', 'line_items'));

    // handle redirect status.
    if (!!redirect_status) {
      return this.handleRedirectStatus(redirect_status);
    }

    // handle abandoned checkout.
    if (!!checkout_id) {
      return this.handleAbandonedCheckout(checkout_id, coupon);
    }

    // handle initial line items.
    if (!!line_items) {
      return this.handleInitialLineItems(line_items, coupon);
    }

    // we have an existing saved checkout id in the session, and we are persisting.
    const id = this.order()?.id;
    if (id && this.persist) {
      return this.handleExistingCheckout(id, coupon);
    }

    return this.handleNewCheckout(coupon);
  }

  /** Handle payment instrument redirect status */
  async handleRedirectStatus(status) {
    console.info('Handling payment redirect.');
    // status failed.
    if (status === 'failed') {
      return this.scError.emit({
        message: __('Payment unsuccessful. Please try again.', 'surecart'),
      });
    }

    // get the
    const id = this.getSessionId();
    if (!id) {
      return this.scError.emit({
        message: __('Could not find checkout. Please contact us before attempting to purchase again.', 'surecart'),
      });
    }

    // success, refetch the checkout
    try {
      this.scSetState.emit('FINALIZE');
      this.scSetState.emit('PAID');
      const checkout = (await fetchCheckout({
        id,
        query: {
          ...this.defaultFormQuery(),
          refresh_status: true,
        },
      })) as Checkout;
      setOrder(checkout, this.formId);

      // TODO: should we even check this?
      if (checkout?.status && ['paid', 'processing'].includes(checkout?.status)) {
        setTimeout(() => {
          this.scPaid.emit();
        }, 50);
      }
    } catch (e) {
      this.handleErrorResponse(e);
    }
  }

  /** Handle abandoned checkout from URL */
  async handleAbandonedCheckout(id, promotion_code) {
    console.info('Handling abandoned checkout.');
    // if coupon code, load the checkout with the code.
    if (promotion_code) {
      return this.loadUpdate({
        discount: { promotion_code },
      });
    }

    const checkout = (await fetchCheckout({
      id,
      query: {
        ...this.defaultFormQuery(),
        refresh_status: true,
      },
    })) as Checkout;
    setOrder(checkout, this.formId);
  }

  /** Handle line items (and maybe ) */
  async handleInitialLineItems(line_items, promotion_code) {
    console.info('Handling initial line items.');
    clearOrder(this.formId, this.mode);
    return this.loadUpdate({
      line_items,
      ...(promotion_code ? { discount: { promotion_code } } : {}),
    });
  }

  /** Handle a brand new checkout. */
  async handleNewCheckout(promotion_code) {
    console.info('Handling new checkout.');
    // get existing form data from defaults (default country selection, etc).
    const data = this.getFormData();
    const line_items = this.addPriceChoices(this.addInitialPrices() || []);

    try {
      this.scSetState.emit('FETCH');
      const order = (await createOrUpdateOrder({
        data: {
          ...this.defaultFormData(),
          ...data,
          ...(promotion_code ? { discount: { promotion_code } } : {}),
          line_items,
        },
        query: this.defaultFormQuery(),
      })) as Checkout;
      setOrder(order, this.formId);
      this.scSetState.emit('RESOLVE');
    } catch (e) {
      console.error(e);
      this.handleErrorResponse(e);
    }
  }

  /** Handle existing checkout */
  async handleExistingCheckout(id, promotion_code) {
    if (!id) return this.handleNewCheckout(promotion_code);
    console.info('Handling existing checkout.');
    try {
      this.scSetState.emit('FETCH');
      const order = (await createOrUpdateOrder({
        id,
        data: {
          ...this.defaultFormData(),
          ...(promotion_code ? { discount: { promotion_code } } : {}),
        },
        query: this.defaultFormQuery(),
      })) as Checkout;
      setOrder(order, this.formId);
      this.scSetState.emit('RESOLVE');
    } catch (e) {
      console.error(e);
      this.handleErrorResponse(e);
    }
  }

  /** Handle the error response. */
  async handleErrorResponse(e) {
    // reinitalize if order not found.
    if (['checkout.not_found'].includes(e?.code)) {
      clearOrder(this.formId, this.mode);
      return this.handleNewCheckout(false);
    }

    if (e?.additional_errors?.[0]?.code === 'order.line_items.old_price_versions') {
      await this.loadUpdate({
        id: this.order()?.id,
        data: {
          status: 'draft',
          refresh_price_versions: true,
        },
      });
      return;
    }

    if (['order.invalid_status_transition'].includes(e?.code)) {
      await this.loadUpdate({
        id: this.order()?.id,
        data: {
          status: 'draft',
        },
      });
      this.handleFormSubmit();
      return;
    }

    // expired
    if (e?.code === 'rest_cookie_invalid_nonce') {
      this.scSetState.emit('EXPIRE');
      return;
    }

    // paid
    if (e?.code === 'readonly') {
      clearOrder(this.formId, this.mode);
      window.location.assign(removeQueryArgs(window.location.href, 'order'));
      return;
    }

    console.log('emit', e);
    this.scError.emit(e);
    this.scSetState.emit('REJECT');
  }

  /** Default data always sent with the session. */
  defaultFormData() {
    return {
      currency: this.order()?.currency || this.currencyCode,
      live_mode: this.mode !== 'test',
      group_key: this.groupId,
    };
  }

  defaultFormQuery() {
    return {
      form_id: this.formId,
      ...(this.stripePaymentElement ? { stage_processor_type: 'stripe' } : {}),
    };
  }

  /** Looks through children and finds items needed for initial session. */
  async initialize(args = {}) {
    let line_items = this.addInitialPrices() || [];
    line_items = this.addPriceChoices(line_items);

    if (line_items?.length) {
      return this.loadUpdate({ line_items, ...args });
    } else {
      return this.loadUpdate({ ...args });
    }
  }

  /** Add prices that are passed into the component. */
  addInitialPrices() {
    if (!this?.prices?.length) return [];

    // check for id
    if (this.prices.some(p => !p?.id)) {
      return;
    }

    // add prices that are passed into this component.
    return this.prices.map(price => {
      return {
        price_id: price.id,
        quantity: price.quantity,
      };
    });
  }

  /** Add default prices that may be selected in form. */
  addPriceChoices(line_items = []) {
    const elements = this.el.querySelectorAll('[price-id]') as any;

    elements.forEach(el => {
      // handle price choices.
      if (el.checked) {
        line_items.push({
          quantity: el.quantity || 1,
          price_id: el.priceId,
          ...(el.defaultAmount ? { ad_hoc_amount: el.defaultAmount } : {}),
        });
      }
      // handle donation default amount.
      if (el.defaultAmount) {
        line_items.push({
          quantity: el.quantity || 1,
          price_id: el.priceId,
          ad_hoc_amount: el.defaultAmount,
        });
      }
    });

    return line_items;
  }

  getSessionId() {
    // check url first.
    const checkoutId = getQueryArg(window.location.href, 'checkout_id');
    if (!!checkoutId) {
      return checkoutId;
    }

    // check existing order.
    if (this.order()?.id) {
      return this.order()?.id;
    }

    // we don't have and order id.
    return null;
  }

  async fetchCheckout(id, { query = {}, data = {} } = {}) {
    try {
      this.scSetState.emit('FETCH');
      const checkout = (await createOrUpdateOrder({
        id,
        query: {
          ...this.defaultFormQuery(),
          ...query,
        },
        data,
      })) as Checkout;
      this.scSetState.emit('RESOLVE');
      return checkout;
    } catch (e) {
      this.handleErrorResponse(e);
    }
  }

  /** Fetch a session. */
  async fetch(query = {}) {
    try {
      this.scSetState.emit('FETCH');
      const checkout = (await fetchCheckout({
        id: this.getSessionId(),
        query: {
          ...this.defaultFormQuery(),
          ...query,
        },
      })) as Checkout;
      setOrder(checkout, this.formId);
      this.scSetState.emit('RESOLVE');
    } catch (e) {
      this.handleErrorResponse(e);
    }
  }

  /** Update a session */
  async update(data: any = {}, query = {}) {
    try {
      const order = (await createOrUpdateOrder({
        id: this.getSessionId(),
        data: {
          ...this.defaultFormData(),
          ...data,
          metadata: {
            ...(data?.metadata || {}),
            page_url: window.location.href,
            page_id: window?.scData?.page_id,
          },
        },
        query: {
          ...this.defaultFormQuery(),
          ...query,
        },
      })) as Checkout;
      setOrder(order, this.formId);
    } catch (e) {
      // reinitalize if order not found.
      if (['checkout.not_found'].includes(e?.code)) {
        clearOrder(this.formId, this.mode);
        return this.initialize();
      }
      console.error(e);
      throw e;
    }
  }

  /** Updates a session with loading status changes. */
  async loadUpdate(data = {}) {
    try {
      this.scSetState.emit('FETCH');
      await this.update(data);
      this.scSetState.emit('RESOLVE');
    } catch (e) {
      this.handleErrorResponse(e);
    }
  }

  render() {
    return (
      <sc-line-items-provider order={this.order()} onScUpdateLineItems={e => this.loadUpdate({ line_items: e.detail as Array<LineItemData> })}>
        <slot />
      </sc-line-items-provider>
    );
  }
}
