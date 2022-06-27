import { Component, Host, h, Prop, State, Watch } from '@stencil/core';
import { Order } from '../../../../types';

@Component({
  tag: 'sc-cart-loader',
  shadow: true,
})
export class ScCartLoader {
  /** The form id to use for the cart. */
  @Prop({ reflect: true }) formId: string;

  @Prop() template: string;

  @State() order: Order;

  @State() loaded: boolean;

  @Watch('order')
  handleOrderChange() {
    if (this.order?.line_items?.pagination?.count) {
      if (this.pageHasForm()) return null;
      this.loaded = true;
    }
  }

  /**
   * Search for the sc-checkout component on a page to make sure
   * we don't show the cart on a checkout page.
   */
  pageHasForm() {
    return !!document.querySelector('sc-checkout');
  }

  render() {
    return (
      <Host>
        <sc-model-cache-provider
          cacheKey={`sc-checkout-order-${this?.formId}`}
          model={this.order}
          onScUpdateModel={e => (this.order = e.detail as Order)}
        ></sc-model-cache-provider>

        <div innerHTML={this.loaded ? this.template : ''}></div>
      </Host>
    );
  }
}
