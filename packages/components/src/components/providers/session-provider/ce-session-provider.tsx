import { createOrUpdateOrder, finalizeSession } from '../../../services/session';
import { Order, LineItemData, PriceChoice } from '../../../types';
import { getSessionId, getURLLineItems, populateInputs, removeSessionIdFromStorage } from './helpers/session';
import { Component, h, Prop, Event, EventEmitter, Element, State, Watch, Listen } from '@stencil/core';
import { removeQueryArgs } from '@wordpress/url';

@Component({
  tag: 'ce-session-provider',
  shadow: true,
})
export class CeSessionProvider {
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

  /** An array of prices to pre-fill in the form. */
  @Prop() prices: Array<PriceChoice> = [];

  /** Currency Code */
  @Prop() currencyCode: string = 'usd';

  /** Should we persist the session. */
  @Prop() persist: boolean;

  /** Set the checkout state */
  @Prop() setState: (state: string) => void;

  /** Update line items event */
  @Event() ceUpdateOrderState: EventEmitter<Order>;

  /** Update line items event */
  @Event() ceUpdateDraftState: EventEmitter<Order>;

  /** Update line items event */
  @Event() ceError: EventEmitter<{ message: string; code?: string; data?: any; additional_errors?: any } | {}>;

  /** Set the state */
  @Event() ceSetState: EventEmitter<string>;

  /** Paid event */
  @Event() cePaid: EventEmitter<void>;

  /** Holds the checkout session to update. */
  @State() session: Order;

  /** Sync this session back to parent. */
  @Watch('session')
  handleSessionUpdate(val) {
    if (val?.status === 'paid') {
      this.cePaid.emit();
    }
    this.ceUpdateOrderState.emit(val);
  }

  /** Store checkout session in localstorage */
  @Watch('order')
  handleOrderChange(val) {
    if (val?.id) {
      localStorage.setItem(this.groupId, val.id);
    }
    if (val.status === 'paid') {
      window.localStorage.removeItem(this.groupId);
    }
    /** Populate any inputs from the session */
    populateInputs(this.el, val);
  }

  /** Update form state when form data changes */
  // @Listen('ceFormChange')
  // handleFormChange(e) {
  //   const data = e.detail;
  //   this.ceUpdateDraftState.emit(data);
  //   if (Object.values(data || {}).every(item => !item)) return;
  //   // we update silently here since we parse form data on submit.
  //   this.update(this.parseFormData(data));
  // }

  @Listen('ceUpdateOrder')
  @Listen('ceUpdateSession')
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
      'tax_identifier.number_type': tax_number_type,
      'tax_identifier.number': tax_number,
      ...rest
    } = data;

    return {
      password,
      metadata: rest || {},
    };
  }

  /**
   * Handles the form submission.
   * @param e
   */
  @Listen('ceFormSubmit')
  async handleFormSubmit(e) {
    this.ceError.emit({});

    // Get current form state.
    const json = await this.el.querySelector('ce-form').getFormJson();
    let data = this.parseFormData(json);

    // add additional data passed with event
    if (Object.keys(e?.detail?.data || {})?.length) {
      data = { ...data, ...e?.detail?.data };
    }

    // first lets make sure the session is updated before we process it.
    await this.loadUpdate(data);

    // first validate server-side and get key
    try {
      this.ceSetState.emit('FETCH');
      this.session = await finalizeSession({
        id: this.order.id,
        data,
        query: {
          ...this.defaultFormQuery(),
        },
        processor: 'stripe',
      });
      switch (this.session.status) {
        case 'finalized':
          this.ceSetState.emit('FETCH');
          break;
        case 'paid':
          this.ceSetState.emit('FETCH');
          break;
        default:
          this.ceSetState.emit('RESOLVE');
          break;
      }
    } catch (e) {
      if (e?.additional_errors?.[0]?.code === 'order.line_items.old_price_versions') {
        // Remove saved order.
        window.localStorage.removeItem(this.groupId);
      }
      // make it a draft again and resubmit if status is incorrect.
      if (['order.invalid_status_transition'].includes(e?.code)) {
        await this.loadUpdate({
          id: this.order.id,
          data: {
            status: 'draft',
          },
        });
        this.handleFormSubmit(e);
        return;
      }
      this.handleErrorResponse(e);
    }
  }

  @Listen('cePaid')
  async handlePaid() {
    this.ceSetState.emit('PAID');
  }

  @Listen('cePayError')
  async handlePayError() {
    this.ceSetState.emit('REJECT');
  }

  /** Handles coupon updates. */
  @Listen('ceApplyCoupon')
  async handleCouponApply(e) {
    const promotion_code = e.detail;
    this.ceError.emit({});
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
      this.ceSetState.emit('EXPIRE');
      return;
    }

    // paid
    if (e?.code === 'readonly') {
      window.localStorage.removeItem(this.groupId);
      this.ceSetState.emit('PAID');
      return;
    }

    // something went wrong
    if (e?.message) {
      this.ceError.emit(e);
    }

    // handle curl timeout errors.
    if (e?.code === 'http_request_failed') {
      this.ceError.emit({ message: 'Something went wrong. Please reload the page and try again.' });
    }

    this.ceSetState.emit('REJECT');
  }

  /** Default data always sent with the session. */
  defaultFormData() {
    return {
      return_url: window.location.href,
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

    if (line_items && line_items?.length) {
      // remove line items from url
      window.history.replaceState({}, document.title, removeQueryArgs(window.location.href, 'line_items'));
      return this.loadUpdate({ line_items });
    }

    const id = getSessionId(this.groupId, this.order);

    // fetch or initialize a session.
    if (id && this.persist) {
      this.fetch();
    } else {
      this.initialize();
    }
  }

  /** Looks through children and finds items needed for initial session. */
  async initialize() {
    let line_items = this.addInitialPrices() || [];
    line_items = this.addPriceChoices(line_items);

    if (line_items?.length) {
      return this.loadUpdate({ line_items });
    } else {
      return this.loadUpdate();
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
      if (el.checked) {
        line_items.push({
          quantity: el.quantity || 1,
          price_id: el.priceId,
        });
      }
    });

    return line_items;
  }

  getSessionId() {
    if (this.order?.id) {
      return this.order.id;
    }

    const id = getSessionId(this.groupId, this.order);
    if (this.persist) {
      return id;
    }
  }

  /** Fetch a session. */
  async fetch() {
    this.loadUpdate({ status: 'draft' });
  }

  /** Update a session */
  async update(data = {}) {
    try {
      this.session = (await createOrUpdateOrder({
        id: this.getSessionId(),
        data: {
          ...this.defaultFormData(),
          ...data,
        },
        query: {
          ...this.defaultFormQuery(),
        },
      })) as Order;
    } catch (e) {
      // reinitalize if order not found.
      if (['order.not_found'].includes(e?.code)) {
        removeSessionIdFromStorage(this.groupId);
        return this.initialize();
      }
      console.error(e);
      throw e;
    }
  }

  /** Updates a session with loading status changes. */
  async loadUpdate(data = {}) {
    try {
      this.ceSetState.emit('FETCH');
      await this.update({ ...this.defaultFormData(), ...data });
      this.ceSetState.emit('RESOLVE');
    } catch (e) {
      this.handleErrorResponse(e);
    }
  }

  render() {
    return (
      <ce-line-items-provider order={this.order} onCeUpdateLineItems={e => this.loadUpdate({ line_items: e.detail as Array<LineItemData> })}>
        <slot />
      </ce-line-items-provider>
    );
  }
}
