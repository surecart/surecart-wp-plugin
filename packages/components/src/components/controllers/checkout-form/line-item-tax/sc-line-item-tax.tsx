import { Component, Prop, h } from '@stencil/core';
import { sprintf, __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';
import { Order } from '../../../../types';

@Component({
  tag: 'sc-line-item-tax',
  styleUrl: 'sc-line-item-tax.scss',
  shadow: true,
})
export class ScLineItemTax {
  @Prop() order: Order;
  @Prop() loading: boolean;

  renderLabel() {
    if (this?.order?.tax_status === 'calculated') {
      return `${this?.order?.tax_label} ${this.renderPercent()}`;
    }
    // translators: %s: tax label
    return `${sprintf(__('Estimated %s', 'surecart'), this?.order?.tax_label)} ${this.renderPercent()}`;
  }

  renderPercent() {
    if (this.order?.tax_rate) {
      return `(${this.order.tax_rate}%)`;
    }
    return '';
  }

  render() {
    // hide if tax is 0
    if (!this?.order?.tax_amount) {
      return null;
    }

    return (
      <sc-line-item>
        <span slot="description">{this.renderLabel()}</span>
        <span slot="price">
          <sc-format-number type="currency" currency={this?.order?.currency || 'usd'} value={this?.order?.tax_amount} />
        </span>
      </sc-line-item>
    );
  }
}

openWormhole(ScLineItemTax, ['order', 'loading'], false);
