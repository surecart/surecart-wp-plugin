import { Component, Element, Event, EventEmitter, h, Listen, Prop, State, Watch } from '@stencil/core';
import { removeQueryArgs } from '@wordpress/url';
import { __ } from '@wordpress/i18n';

import { createOrUpdateOrder, finalizeSession } from '../../../services/session';
import { LineItemData, Order, PriceChoice } from '../../../types';
import { getSessionId, getURLCoupon, getURLLineItems, populateInputs, removeSessionId, setSessionId } from './helpers/session';

@Component({
  tag: 'sc-session-provider',
  shadow: true,
})
export class ScSessionProvider {
  /** Element */
  @Element() el: HTMLElement;

  /** Order Object */
  @Prop() order: Order;

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
  @Prop() persist: boolean;

  /** Set the checkout state */
  @Prop() setState: (state: string) => void;

  /** The processor. */
  @Prop() processor: 'stripe' | 'paypal' = 'stripe';

  /** Update line items event */
  @Event() scUpdateOrderState: EventEmitter<Order>;

  /** Update line items event */
  @Event() scUpdateDraftState: EventEmitter<Order>;

  /** Update line items event */
  @Event() scError: EventEmitter<{ message: string; code?: string; data?: any; additional_errors?: any } | {}>;

  /** Set the state */
  @Event() scSetState: EventEmitter<string>;

  /** Paid event */
  @Event() scPaid: EventEmitter<void>;

  /** Holds the checkout session to update. */
  @State() session: Order;

  /** Sync this session back to parent. */
  @Watch('session')
  handleSessionUpdate(val) {
    if (val?.status === 'paid') {
      this.scPaid.emit();
    }
    this.scUpdateOrderState.emit(val);
  }

  /** Store checkout session in localstorage */
  @Watch('order')
  handleOrderChange(val) {
    if (val?.id) {
      setSessionId(this.groupId, val.id, this.modified);
    }
    if (val.status === 'paid') {
      removeSessionId(this.groupId);
    }
    /** Populate any inputs from the session */
    populateInputs(this.el, val);
  }

  @Listen('scUpdateOrder')
  @Listen('scUpdateSession')
  handleUpdateSession(e) {
    const data = e.detail;
    this.loadUpdate(data);
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

  parseFormData(data) {
    const {
      email,
      name,
      password,
      shipping_city,
      shipping_country,
      shipping_line_1,
      shipping_line_2,
      shipping_postal_code,
      shipping_state,
      billing_city,
      billing_country,
      billing_line_1,
      billing_line_2,
      billing_postal_code,
      billing_state,
      'tax_identifier.number_type': tax_number_type,
      'tax_identifier.number': tax_number,
      ...rest
    } = data;

    const shipping_address = {
      ...(shipping_city ? { city: shipping_city } : {}),
      ...(shipping_country ? { country: shipping_country } : {}),
      ...(shipping_line_1 ? { line_1: shipping_line_1 } : {}),
      ...(shipping_line_2 ? { line_2: shipping_line_2 } : {}),
      ...(shipping_postal_code ? { postal_code: shipping_postal_code } : {}),
      ...(shipping_state ? { state: shipping_state } : {}),
    };

    const billing_address = {
      ...(billing_city ? { city: billing_city } : {}),
      ...(billing_country ? { country: billing_country } : {}),
      ...(billing_line_1 ? { line_1: billing_line_1 } : {}),
      ...(billing_line_2 ? { line_2: billing_line_2 } : {}),
      ...(billing_postal_code ? { postal_code: billing_postal_code } : {}),
      ...(billing_state ? { state: billing_state } : {}),
    };

    return {
      ...(name ? { name } : {}),
      ...(email ? { email } : {}),
      ...(password ? { password } : {}),
      ...(Object.keys(shipping_address || {}).length ? { shipping_address } : {}),
      ...(Object.keys(billing_address || {}).length ? { billing_address } : {}),
      ...(tax_number_type && tax_number ? { tax_identifier: { number: tax_number, number_type: tax_number_type } } : {}),
      metadata: rest || {},
    };
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
    const json = await this.el.querySelector('sc-form').getFormJson();
    let data = this.parseFormData(json);

    // first lets make sure the session is updated before we process it.
    try {
      await this.update({ ...this.defaultFormData(), ...data });
    } catch (e) {
      console.error(e);
      this.scSetState.emit('REJECT');
      this.handleErrorResponse(e);
    }

    // first validate server-side and get key
    try {
      this.session = await finalizeSession({
        id: this.order.id,
        data,
        query: {
          ...this.defaultFormQuery(),
        },
        processor: this.processor,
      });
    } catch (e) {
      // handle old price versions by refreshing.
      if (e?.additional_errors?.[0]?.code === 'order.line_items.old_price_versions') {
        await this.loadUpdate({
          id: this.order.id,
          data: {
            status: 'draft',
            refresh_price_versions: true,
          },
        });
        return;
      }
      // make it a draft again and resubmit if status is incorrect.
      if (['order.invalid_status_transition'].includes(e?.code)) {
        await this.loadUpdate({
          id: this.order.id,
          data: {
            status: 'draft',
          },
        });
        this.handleFormSubmit();
        return;
      }
      this.handleErrorResponse(e);
    }
  }

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

  /** Handle the error response. */
  handleErrorResponse(e) {
    // expired
    if (e?.code === 'rest_cookie_invalid_nonce') {
      this.scSetState.emit('EXPIRE');
      return;
    }

    // paid
    if (e?.code === 'readonly') {
      window.localStorage.removeItem(this.groupId);
      this.scSetState.emit('PAID');
      return;
    }

    // something went wrong
    if (e?.message) {
      this.scError.emit(e);
    }

    // handle curl timeout errors.
    if (e?.code === 'http_request_failed') {
      this.scError.emit({ message: 'Something went wrong. Please reload the page and try again.' });
    }

    this.scSetState.emit('REJECT');
  }

  /** Default data always sent with the session. */
  defaultFormData() {
    return {
      return_url: window.top.location.href,
      currency: this.currencyCode,
      live_mode: this.mode !== 'test',
      group_key: this.groupId,
    };
  }

  defaultFormQuery() {
    return {
      form_id: this.formId,
    };
  }

  /** Find or create session on load. */
  componentDidLoad() {
    const line_items = getURLLineItems();
    const promotion_code = getURLCoupon();

    if (line_items && line_items?.length) {
      // remove line items from url
      window.history.replaceState({}, document.title, removeQueryArgs(window.location.href, 'line_items'));
      return this.loadUpdate({ line_items });
    }

    const id = getSessionId(this.groupId, this.order, this.modified);

    // fetch or initialize a session.
    if (id && this.persist) {
      this.fetch({ ...(promotion_code ? { discount: { promotion_code } } : {}) });
    } else {
      this.initialize({ ...(promotion_code ? { discount: { promotion_code } } : {}) });
    }
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
    if (this.order?.id) {
      return this.order.id;
    }

    const id = getSessionId(this.groupId, this.order, this.modified);
    if (this.persist) {
      return id;
    }
  }

  /** Fetch a session. */
  async fetch(args = {}) {
    this.loadUpdate({ status: 'draft', ...args });
  }

  /** Update a session */
  async update(data = {}, query = {}) {
    try {
      this.session = (await createOrUpdateOrder({
        id: this.getSessionId(),
        data: {
          ...this.defaultFormData(),
          ...data,
        },
        query: {
          ...this.defaultFormQuery(),
          ...query,
        },
      })) as Order;
    } catch (e) {
      // reinitalize if order not found.
      if (['order.not_found'].includes(e?.code)) {
        removeSessionId(this.groupId);
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
      await this.update({ ...this.defaultFormData(), ...data });
      this.scSetState.emit('RESOLVE');
    } catch (e) {
      this.handleErrorResponse(e);
    }
  }

  render() {
    return (
      <sc-line-items-provider order={this.order} onScUpdateLineItems={e => this.loadUpdate({ line_items: e.detail as Array<LineItemData> })}>
        <slot />
      </sc-line-items-provider>
    );
  }
}
