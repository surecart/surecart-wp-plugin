import { Component, Host, h, Prop, Element } from '@stencil/core';

// import { createContext } from 'stencil-context';

// const defaultValue = { products: [] };
// const { Provider } = createContext(defaultValue);

@Component({
  tag: 'presto-checkout',
  styleUrl: 'presto-checkout.scss',
  shadow: false,
})
export class PrestoCheckout {
  @Element() el: HTMLElement;
  @Prop() productIds: Array<any>;

  render() {
    return (
      <Host>
        {/* <Provider value={{ products: this.productIds }}> */}
        <div class="presto-checkout-container">
          <slot></slot>
        </div>
        {/* </Provider> */}
      </Host>
    );
  }
}
