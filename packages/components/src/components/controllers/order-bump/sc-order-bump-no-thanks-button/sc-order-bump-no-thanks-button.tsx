import { Component, Host, Prop, h } from '@stencil/core';
// import { state } from '@store/product';

@Component({
  tag: 'sc-order-bump-no-thanks-button',
  styleUrl: 'sc-order-bump-no-thanks-button.css',
  shadow: true,
})
export class ScOrderBumpNoThanksButton {
  handleCloseBump(e) {
    // Stop the bump timer and redirect to no thanks URL.
    console.log('handleCloseBump::', e);
  }

  render() {
    return (
      <Host onClick={e => this.handleCloseBump(e)}>
        <slot />
      </Host>
    );
  }
}
