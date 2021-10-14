import { Component, h, Prop, Element } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';
import { CheckoutSession, CheckoutState } from '../../../types';
@Component({
  tag: 'ce-submit',
  shadow: false,
})
export class CeSubmit {
  @Element() host: HTMLDivElement;

  /** Is the form loading */
  @Prop() state: CheckoutState;

  /** The button's size. */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'large';

  /** Draws the button full-width */
  @Prop({ reflect: true }) full?: boolean = true;

  /** Draws the button full-width */
  @Prop() text: string = '';

  /** Total */
  @Prop() showTotal: boolean = false;

  /** Checkout session object */
  @Prop() checkoutSession: CheckoutSession;

  loading() {
    return ['updating', 'paying', 'finalized'].includes(this.state);
  }

  render() {
    return (
      <ce-button loading={this.loading()} disabled={this.loading()} type="primary" submit full={this.full} size={this.size}>
        <slot>{this.text}</slot>
        {this.showTotal && <span class="total"> - {this.checkoutSession.amount_total}</span>}
      </ce-button>
    );
  }
}

openWormhole(CeSubmit, ['state', 'checkoutSession'], false);
