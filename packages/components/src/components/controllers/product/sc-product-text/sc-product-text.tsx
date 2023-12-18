import { Component, Host, h, Prop } from '@stencil/core';
import { state } from '@store/product';

@Component({
  tag: 'sc-product-text',
  styleUrl: 'sc-product-text.css',
  shadow: true,
})
export class ScProductText {
  @Prop() text: 'name' | 'description' = 'name';
  @Prop() productId: string;

  render() {
    const product = state[this.productId].product;

    if (product?.[this.text]) {
      return <span style={{ whiteSpace: 'pre-line' }} innerHTML={product[this.text]}></span>;
    }
    return (
      <Host>
        <slot />
      </Host>
    );
  }
}
