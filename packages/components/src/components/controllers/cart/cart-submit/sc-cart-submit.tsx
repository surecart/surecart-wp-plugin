import { Component, h, Host, Prop } from '@stencil/core';
import { formBusy } from '@store/form/getters';

@Component({
  tag: 'sc-cart-submit',
  styleUrl: 'sc-cart-submit.scss',
  shadow: false,
})
export class ScCartSubmit {
  /** Is the cart busy */
  @Prop() busy: boolean;

  render() {
    return (
      <Host
        class={{ 'is-busy': formBusy() || this.busy, 'is-disabled': formBusy() || this.busy }}
        onClick={() => {
          this.busy = true;
          return true;
        }}
      >
        <slot />
      </Host>
    );
  }
}
