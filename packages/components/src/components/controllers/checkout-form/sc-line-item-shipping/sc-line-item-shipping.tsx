import { Component, Prop, h } from '@stencil/core';
import { Checkout } from 'src/types';
import { openWormhole } from 'stencil-wormhole';
import { __ } from '@wordpress/i18n';

@Component({
  tag: 'sc-line-item-shipping',
  styleUrl: 'sc-line-item-shipping.scss',
  shadow: true,
})
export class ScLineItemShipping {
  /** The order */
  @Prop() order: Checkout;
  /** Whether parent is loading */
  @Prop() loading: boolean;
  /**Label */
  @Prop() label:string ;

  render() {
    if (this.order?.shipping_amount === 0) return;

    if (this.loading) {
      return (
        <sc-line-item>
          <sc-skeleton slot="title" style={{ width: '120px', display: 'inline-block' }}></sc-skeleton>
          <sc-skeleton slot="price" style={{ 'width': '70px', 'display': 'inline-block', '--border-radius': '6px' }}></sc-skeleton>
        </sc-line-item>
      );
    }

    if (!this.order?.currency) return;

    return (
      <sc-line-item>
        <span slot="description">
          {this.label || __('Shipping Amount','surecart') }
        </span>
        <span slot="price">
          <sc-format-number type="currency" currency={this.order?.currency} value={this.order?.shipping_amount}></sc-format-number>
          </span>
      </sc-line-item>
    );
  }
}

openWormhole(ScLineItemShipping, ['order', 'loading', 'calculating'], false);
