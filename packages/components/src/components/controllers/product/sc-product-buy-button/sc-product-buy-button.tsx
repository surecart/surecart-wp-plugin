import { Component, Element, h, Host, Prop, State, Watch } from '@stencil/core';
import { getOrder, setOrder } from '@store/checkouts';
import { onChange, state } from '@store/product';
import { toggleCart } from '@store/ui';
import { __ } from '@wordpress/i18n';

import { addLineItem } from '../../../../services/session';
import { Checkout } from '../../../../types';
import { addQueryArgs } from '@wordpress/url';

@Component({
  tag: 'sc-product-buy-button',
  styleUrl: 'sc-product-buy-button.scss',
  shadow: false,
})
export class ScProductBuyButton {
  @Element() el: HTMLScProductBuyButtonElement;

  private priceInput: HTMLScPriceInputElement;
  private button: HTMLAnchorElement;

  /** Is this an add to cart button? */
  @Prop() addToCart: boolean;

  /** Is the order busy */
  @Prop() busy: boolean;

  @Prop() buttonText: string;

  /** The button type. */
  @Prop({ reflect: true }) type: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'text' | 'link' = 'default';

  /** The button's size. */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** Outline */
  @Prop() outline: boolean = false;

  /** Full */
  @Prop() full: boolean = false;

  /** Icon to show. */
  @Prop() icon: string;

  /** Show the total. */
  @Prop() showTotal: boolean;

  @Prop() text: string;

  /** Is the dialog open? */
  @State() dialog: boolean = false;

  /** The ad hoc amount */
  @State() adHocAmount: number;

  getOrder() {
    return getOrder(state?.formId, state.mode);
  }

  @Watch('dialog')
  handleDialogChange() {
    if (!this.dialog) return;
    setTimeout(() => {
      this.priceInput?.triggerFocus();
    }, 50);
  }

  handleCartClick(e) {
    e.preventDefault();
    if (state?.selectedPrice?.ad_hoc) {
      this.dialog = true;
    } else {
      this.addPriceToCart();
    }
  }

  /** Add the item to cart. */
  async addPriceToCart() {
    if (!state.selectedPrice?.id) return;
    if (state.selectedPrice?.ad_hoc && !state.adHocAmount) return;
    try {
      this.busy = true;
      const checkout = await addLineItem({
        checkout: this.getOrder(),
        data: {
          price: state.selectedPrice?.id,
          ad_hoc_amount: state.adHocAmount,
          quantity: state.adHocAmount ? 1 : state.quantity,
        },
        live_mode: state.mode !== 'test',
      });
      setOrder(checkout as Checkout, state.formId);
      if (!this.addToCart) {
        window.location.assign(state.checkoutUrl);
      } else {
        toggleCart(true);
        this.busy = false;
        this.dialog = false;
      }
    } catch (e) {
      console.error(e);
      state.error = e;
    }
  }

  componentWillLoad() {
    this.button = this.el.querySelector('a');
    if (this.button) {
      this.setButtonLink();
      onChange('selectedPrice', () => this.setButtonLink());
      onChange('adHocAmount', () => this.setButtonLink());
      onChange('quantity', () => this.setButtonLink());
    }
  }

  setButtonLink() {
    this.button.href = addQueryArgs(state?.checkoutUrl, {
      line_items: [
        {
          price: state.selectedPrice?.id,
          quantity: state.adHocAmount ? 1 : state.quantity,
          ...(state.selectedPrice?.ad_hoc ? { ad_hoc_amount: state.adHocAmount } : {}),
        },
      ],
    });
  }

  render() {
    return (
      <Host class={{ 'is-busy': this.busy }} onClick={e => this.handleCartClick(e)}>
        <slot />

        {state?.selectedPrice?.ad_hoc && (
          <sc-dialog open={this.dialog} onScRequestClose={() => (this.dialog = false)}>
            <span class="dialog__header" slot="label">
              {!!state?.product?.image_url && (
                <div class="dialog__image">
                  <img src={state?.product?.image_url} />
                </div>
              )}
              <div class="dialog__header-text">
                <div class="dialog__action">{__('Enter An Amount', 'surecart')}</div>
                <div class="dialog__product-name">{state?.product?.name}</div>
              </div>
            </span>

            <sc-form
              onScSubmit={e => {
                console.log(e);
                e.stopImmediatePropagation();
                this.addPriceToCart();
              }}
              onScFormSubmit={e => e.stopImmediatePropagation()}
            >
              <sc-price-input
                ref={el => (this.priceInput = el as HTMLScPriceInputElement)}
                value={state.adHocAmount?.toString?.()}
                currency-code={state?.selectedPrice?.currency}
                min={state?.selectedPrice?.ad_hoc_min_amount}
                max={state?.selectedPrice?.ad_hoc_max_amount}
                onScInput={e => (state.adHocAmount = parseInt(e.target.value))}
                required
              />
              <sc-button type="primary" full submit busy={this.busy}>
                {this.buttonText || __('Add To Cart', 'surecart')}
              </sc-button>
            </sc-form>
          </sc-dialog>
        )}
      </Host>
    );
  }
}
