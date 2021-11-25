import { Component, h, Prop, Event, EventEmitter, Element, State, Watch, Listen } from '@stencil/core';
import { CheckoutSession, LineItemData, PriceChoice } from '../../../types';
import { getSessionId, getURLLineItems, populateInputs } from './helpers/session';
import { createOrUpdateSession, finalizeSession } from '../../../services/session';
import { removeQueryArgs } from '@wordpress/url';

@Component({
  tag: 'ce-session-provider',
  shadow: true,
})
export class CeSessionProvider {
  /** Element */
  @Element() el: HTMLElement;

  /** CheckoutSession Object */
  @Prop() checkoutSession: CheckoutSession;

  /** Group id */
  @Prop() groupId: string;

  /** An array of prices to pre-fill in the form. */
  @Prop() prices: Array<PriceChoice> = [];

  /** Currency Code */
  @Prop() currencyCode: string = 'usd';

  /** Should we persist the session. */
  @Prop() persist: boolean;

  /** Set the checkout state */
  @Prop() setState: (state: string) => void;

  /** Update line items event */
  @Event() ceUpdateSession: EventEmitter<CheckoutSession>;

  /** Update line items event */
  @Event() ceOnPaid: EventEmitter<string>;

  /** Update line items event */
  @Event() ceError: EventEmitter<{ message: string; code?: string; data?: any; additional_errors?: any } | {}>;

  /** Holds the checkout session to update. */
  @State() session: CheckoutSession;

  /** Sync this session back to parent. */
  @Watch('session')
  handleSessionUpdate(val) {
    this.ceUpdateSession.emit(val);
  }

  /** Store checkout session in localstorage */
  @Watch('checkoutSession')
  handleCheckoutSessionChange(val) {
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
  @Listen('ceFormChange')
  handleFormChange(e) {
    const data = e.detail;
    if (Object.values(data || {}).every(item => !item)) return;
    // we update silently here since we parse form data on submit.
    this.update(this.parseFormData(data));
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
    const { email, name, password, ...rest } = data;
    return {
      email,
      name,
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
    if (Object.keys(e.detail || {})?.length) {
      data = { ...data, ...e.detail };
    }

    // first lets make sure the session is updated before we process it.
    await this.loadUpdate(data);

    // first validate server-side and get key
    try {
      this.setState('FETCH');
      this.session = await finalizeSession({
        id: this.checkoutSession.id,
        data,
        processor: 'stripe',
      });
      if (this.session.status === 'finalized') {
        this.setState('FETCH');
      } else {
        this.setState('RESOLVE');
      }
    } catch (e) {
      if (e?.code === 'checkout_session.invalid_status_transition') {
        await this.loadUpdate({
          id: this.checkoutSession.id,
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
    this.setState('PAID');
  }

  @Listen('cePayError')
  async handlePayError() {
    this.setState('REJECT');
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
      this.setState('EXPIRE');
      return;
    }

    // paid
    if (e?.code === 'readonly') {
      window.localStorage.removeItem(this.groupId);
      this.setState('PAID');
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

    this.setState('REJECT');
  }

  /** Default data always sent with the session. */
  defaultFormData() {
    return {
      return_url: window.location.href,
      currency: this.currencyCode,
      group_key: this.groupId,
    };
  }

  /** Find or create session on load. */
  componentWillLoad() {
    const line_items = getURLLineItems();

    if (line_items && line_items?.length) {
      // remove line items from url
      window.history.replaceState({}, document.title, removeQueryArgs(window.location.href, 'line_items'));
      return this.loadUpdate({ line_items });
    }

    const id = getSessionId(this.groupId, this.checkoutSession);

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
    if (!this?.prices.length) return [];

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
    if (this.checkoutSession?.id) {
      return this.checkoutSession.id;
    }

    const id = getSessionId(this.groupId, this.checkoutSession);
    if (this.persist) {
      return id;
    }
  }

  /** Fetch a session. */
  async fetch() {
    // let line_items = this.addInitialPrices() || [];
    this.loadUpdate({ status: 'draft' });
  }

  /** Update a session */
  async update(data = {}) {
    this.session = (await createOrUpdateSession({
      id: this.getSessionId(),
      data: {
        ...this.defaultFormData(),
        ...data,
      },
    })) as CheckoutSession;
  }

  /** Updates a session with loading status changes. */
  async loadUpdate(data = {}) {
    try {
      this.setState('FETCH');
      await this.update(data);
      this.setState('RESOLVE');
    } catch (e) {
      this.handleErrorResponse(e);
    }
  }

  render() {
    return (
      <ce-line-items-provider checkoutSession={this.checkoutSession} onCeUpdateLineItems={e => this.loadUpdate({ line_items: e.detail as Array<LineItemData> })}>
        <slot />
      </ce-line-items-provider>
    );
  }
}
