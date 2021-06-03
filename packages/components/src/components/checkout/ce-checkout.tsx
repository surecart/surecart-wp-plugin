import { Component, Host, h, Prop, Element } from '@stencil/core';

// import { createContext } from 'stencil-context';

// const defaultValue = { products: [] };
// const { Provider } = createContext(defaultValue);

@Component({
  tag: 'ce-checkout',
  styleUrl: 'ce-checkout.scss',
  shadow: false,
})
export class CECheckout {
  @Element() el: HTMLElement;
  @Prop() productIds: Array<any>;

  render() {
    return (
      <Host>
        {/* <Provider value={{ products: this.productIds }}> */}
        <div class="ce-checkout-container">
          <slot></slot>
        </div>
        {/* </Provider> */}
      </Host>
    );
  }
}
