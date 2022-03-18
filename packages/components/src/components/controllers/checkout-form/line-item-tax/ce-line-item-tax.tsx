import { Component, Prop, h } from '@stencil/core';
import { sprintf, __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';
import { Order } from '../../../../types';

@Component({
  tag: 'ce-line-item-tax',
  styleUrl: 'ce-line-item-tax.scss',
  shadow: true,
})
export class CeLineItemTax {
  @Prop() order: Order;
  @Prop() loading: boolean;

  renderLabel() {
    if (this?.order?.tax_status === 'calculated') {
      return this?.order?.tax_label;
    }
    // translators: %s: tax label
    return sprintf(__('Estimated %s', 'checkout_engine'), this?.order?.tax_label);
  }

  render() {
    // hide if tax is 0
    if (!this?.order?.tax_amount) {
      return null;
    }

    return (
      <ce-line-item>
        <span slot="description">{this.renderLabel()}</span>
        <span slot="price">
          <ce-format-number type="currency" currency={this?.order?.currency || 'usd'} value={this?.order?.tax_amount} />
        </span>
      </ce-line-item>
    );
  }
}

openWormhole(CeLineItemTax, ['order', 'loading'], false);
