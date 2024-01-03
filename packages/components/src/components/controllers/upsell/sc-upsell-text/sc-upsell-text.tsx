import { Component, Host, h, Prop } from '@stencil/core';
// import { state } from '@store/product';

@Component({
  tag: 'sc-upsell-text',
  styleUrl: 'sc-upsell-text.css',
  shadow: true,
})
export class ScUpsellText {
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
