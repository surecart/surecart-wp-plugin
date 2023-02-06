import { Component, Element, h, Listen, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import state, { store } from '../../../../store/product';
// import { getOrder, setOrder } from '../../../../store/checkouts';

/**
 * @part base - The elements base wrapper.
 * @part label - The button label.
 * @part prefix - The button prefix.
 * @part suffix - The button suffix.
 * @part caret - The button caret.
 * @part spinner - The button spinner.
 */
@Component({
  tag: 'sc-product-buy-buttons',
  styleUrl: 'sc-product-buy-buttons.css',
  shadow: true,
})
export class ScProductBuyButtons {
  @Element() el: HTMLScProductBuyButtonsElement;
  // the form id.
  @Prop() formId: number;
  /** Are we in test or live mode. */
  @Prop() mode: 'test' | 'live' = 'live';
  /** The link to the checkout */
  @Prop() checkoutUrl: string;

  /** Holds our buttons. */
  private cartButton: HTMLScButtonElement;
  private buyButton: HTMLScButtonElement;

  @Listen('click')
  handleClick(e) {
    if (e.target.dataset?.action !== 'add-to-cart') {
      return;
    }
  }

  componentWillLoad() {
    // get nested buttons.
    this.cartButton = this.el.querySelector('[data-action="add-to-cart"]');
    this.buyButton = this.el.querySelector('[data-action="buy"]');

    // listen for change events and update button links.
    store.onChange('selectedPrice', () => this.updateLinks());
    store.onChange('quantity', () => this.updateLinks());

    // update the links before load.
    this.updateLinks();
  }

  updateLinks() {
    const link = state.selectedPrice?.id
      ? addQueryArgs(this.checkoutUrl, {
          line_items: [
            {
              price_id: state.selectedPrice?.id,
              quantity: state.quantity,
            },
          ],
        })
      : '#';
    this.cartButton.disabled = !state.selectedPrice;
    this.cartButton.href = link;
    this.buyButton.disabled = !state.selectedPrice;
    this.buyButton.href = link;
  }

  render() {
    return (
      <div class="buy-buttons">
        <slot />
      </div>
    );
  }
}
