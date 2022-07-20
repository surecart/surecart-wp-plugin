import { Component, h, Prop } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';

@Component({
  tag: 'sc-cart-form-submit',
  styleUrl: 'sc-cart-form-submit.scss',
  shadow: false,
})
export class ScCartFormSubmit {
  /** Is the cart busy */
  @Prop() busy: boolean;

  /** The button type. */
  @Prop({ reflect: true }) type: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'text' | 'link' = 'primary';

  /** The button's size. */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** Show a full-width button. */
  @Prop() full: boolean = true;

  /** Icon to show. */
  @Prop() icon: string;

  render() {
    return (
      <sc-button submit type={this.type} size={this.size} full={this.full} loading={this.busy} disabled={this.busy}>
        {!!this.icon && <sc-icon name={this.icon} slot="prefix"></sc-icon>}
        <slot />
      </sc-button>
    );
  }
}
openWormhole(ScCartFormSubmit, ['busy'], false);
