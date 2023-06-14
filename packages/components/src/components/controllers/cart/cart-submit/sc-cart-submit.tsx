import { Component, h, Host, Prop } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';

@Component({
  tag: 'sc-cart-submit',
  styleUrl: 'sc-cart-submit.scss',
  shadow: false,
})
export class ScCartSubmit {
  /** Is the cart busy */
  @Prop() busy: boolean;

  /** The button type. */
  @Prop({ reflect: true }) type: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'text' | 'link' = 'primary';

  /** The button's size. */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** Show a full-width button. */
  @Prop() full: boolean = true;

  @Prop() checkoutLink: string;

  /** Icon to show. */
  @Prop() icon: string;

  render() {
    return (
      <Host
        class={{ 'is-busy': this.busy, 'is-disabled': this.busy }}
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
openWormhole(ScCartSubmit, ['busy', 'checkoutLink'], false);
