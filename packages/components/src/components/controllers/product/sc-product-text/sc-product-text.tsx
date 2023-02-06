import { Component, Host, h, Prop } from '@stencil/core';
import state from '../../../../store/product';

@Component({
  tag: 'sc-product-text',
  styleUrl: 'sc-product-text.css',
  shadow: true,
})
export class ScProductText {
  @Prop() text: 'name' | 'description' = 'name';

  render() {
    if (state.product?.[this.text]) {
      return <span style={{ whiteSpace: 'pre-line' }} innerHTML={state.product[this.text]}></span>;
    }
    return (
      <Host>
        <slot />
      </Host>
    );
  }
}
