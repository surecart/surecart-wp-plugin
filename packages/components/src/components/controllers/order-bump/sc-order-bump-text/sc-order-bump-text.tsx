import { Component, Host, h, Prop } from '@stencil/core';
// import { state } from '@store/product';

@Component({
  tag: 'sc-order-bump-text',
  styleUrl: 'sc-order-bump-text.css',
  shadow: true,
})
export class ScOrderBumpText {
  @Prop() text: 'title' | 'description' = 'title';

  render() {
    // if (state.product?.[this.text]) {
    //   return <span style={{ whiteSpace: 'pre-line' }} innerHTML={state.product[this.text]}></span>;
    // }

    return (
      <Host>
        <slot />
      </Host>
    );
  }
}
