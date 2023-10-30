import { Component, Fragment, h, Listen, Prop, State, Watch } from '@stencil/core';
import apiFetch from '../../../../functions/fetch';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { baseUrl } from '../../../../services/session';
import { getCheckout, setCheckout } from '@store/checkouts/mutations';
import { state as checkoutState } from '@store/checkout';
import uiStore from '@store/ui';
import { expand } from '../../../../services/session';
import { Checkout } from '../../../../types';
import { createErrorNotice } from '@store/notices/mutations';
import { updateFormState } from '@store/form/mutations';
import { formBusy } from '@store/form/getters';

@Component({
  tag: 'sc-cart',
  styleUrl: 'sc-cart.scss',
  shadow: true,
})
export class ScCart {
  /** The drawer */
  private drawer: HTMLScDrawerElement;

  /** Is this open or closed? */
  @State() open: boolean = null;

  /** The form id to use for the cart. */
  @Prop({ reflect: true }) formId: string;

  /** The header for the popout. */
  @Prop() header: string;

  @Prop() checkoutLink: string;

  /** The template for the cart to inject when opened. */
  @Prop() cartTemplate: string;

  /** Are we in test or live mode. */
  @Prop() mode: 'test' | 'live' = 'live';

  /** The checkout url for the button. */
  @Prop() checkoutUrl: string;

  /** Should we force show the cart, even if there's a form on the page? */
  @Prop() alwaysShow: boolean;

  /** Whether the floating button should be visible */
  @Prop() floatingIconEnabled: boolean = true;

  /** The current UI state. */
  @State() uiState: 'loading' | 'busy' | 'navigating' | 'idle' = 'idle';

  @Watch('open')
  handleOpenChange() {
    uiStore.set('cart', { ...uiStore.state.cart, ...{ open: this.open } });
    if (this.open === true) {
      this.fetchOrder();
      setTimeout(() => {
        this.drawer.focus();
      }, 500);
    }
  }

  order() {
    return getCheckout(this.formId, this.mode);
  }

  setCheckout(data) {
    setCheckout(data, this.formId);
  }

  /**
   * Search for the sc-checkout component on a page to make sure
   * we don't show the cart on a checkout page.
   */
  pageHasForm() {
    return !!document.querySelector('sc-checkout');
  }

  /** Count the number of items in the cart. */
  getItemsCount() {
    const items = this.order()?.line_items?.data;
    let count = 0;
    (items || []).forEach(item => {
      count = count + item?.quantity;
    });
    return count;
  }

  @Listen('scSetState')
  handleSetState(e) {
    this.uiState = e.detail;
  }

  @Listen('scCloseCart')
  handleCloseCart() {
    this.open = false;
  }

  /** Fetch the order */
  async fetchOrder() {
    try {
      updateFormState('FETCH');
      checkoutState.checkout = (await apiFetch({
        method: 'GET', // create or update
        path: addQueryArgs(`${baseUrl}${this.order()?.id}`, {
          expand,
        }),
      })) as Checkout;
      updateFormState('RESOLVE');
    } catch (e) {
      console.error(e);
      updateFormState('REJECT');
      createErrorNotice(e);
    }
  }

  componentWillLoad() {
    this.open = !!uiStore.state.cart.open;
    uiStore.onChange('cart', cart => {
      this.open = cart.open;
    });
  }

  state() {
    return {
      uiState: this.uiState,
      checkoutLink: this.checkoutLink,
      loading: this.uiState === 'loading',
      busy: this.uiState === 'busy',
      navigating: this.uiState === 'navigating',
      empty: !checkoutState.checkout?.line_items?.pagination?.count,
      order: checkoutState.checkout,
      lineItems: checkoutState.checkout?.line_items?.data || [],
      tax_status: checkoutState.checkout?.tax_status,
      customerShippingAddress: typeof checkoutState.checkout?.customer !== 'string' ? checkoutState.checkout?.customer?.shipping_address : {},
      shippingAddress: checkoutState.checkout?.shipping_address,
      taxStatus: checkoutState.checkout?.tax_status,
      formId: this.formId,
    };
  }

  render() {
    return (
      <sc-cart-session-provider>
        <sc-drawer ref={el => (this.drawer = el as HTMLScDrawerElement)} open={this.open} onScAfterHide={() => (this.open = false)} onScAfterShow={() => (this.open = true)}>
          {this.open === true && (
            <Fragment>
              <div class="cart__header-suffix" slot="header">
                <slot name="cart-header" />
                <sc-error style={{ '--sc-alert-border-radius': '0' }} slot="header"></sc-error>
              </div>
              <slot />
            </Fragment>
          )}
          {formBusy() && <sc-block-ui z-index={9}></sc-block-ui>}
        </sc-drawer>
      </sc-cart-session-provider>
    );
  }
}
