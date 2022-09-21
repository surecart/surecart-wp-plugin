import { Component, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';
import { Checkout } from '../../../../types';

@Component({
  tag: 'sc-line-item-bump',
  styleUrl: 'sc-line-item-bump.scss',
  shadow: true,
})
export class ScLineItemBump {
  @Prop() order: Checkout;
  @Prop() label: string;
  @Prop() loading: boolean;

  render() {
    if (!this?.order?.bump_amount) {
      return;
    }

    return (
      <sc-line-item>
        <span slot="description">{this.label || __('Bundle Discount', 'surecart')}</span>
        <span slot="price">
          <sc-format-number type="currency" currency={this.order?.currency || 'usd'} value={this.order?.bump_amount}></sc-format-number>
        </span>
      </sc-line-item>
    );
  }
}

openWormhole(ScLineItemBump, ['order'], false);
