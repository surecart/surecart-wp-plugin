import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'sc-cart-icon',
  styleUrl: 'sc-cart-icon.scss',
  shadow: true,
})
export class ScCartIcon {
  /** The icon to show. */
  @Prop() icon: string = 'shopping-bag';

  /** The count to show in the cart icon. */
  @Prop() count: number = 0;

  render() {
    return (
      <div class={{ cart: true }} part="base">
        <div class="cart__container">
          <div class={{ cart__counter: true }}>{this.count}</div>
          <slot>
            <sc-icon name={this.icon}></sc-icon>
          </slot>
        </div>
        <sc-register-icon-library></sc-register-icon-library>
      </div>
    );
  }
}
