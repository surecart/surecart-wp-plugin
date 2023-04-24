import { Component, Prop, h, Fragment } from '@stencil/core';
import { sprintf, __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';
import { Checkout } from '../../../../types';

@Component({
  tag: 'sc-line-item-tax',
  styleUrl: 'sc-line-item-tax.scss',
  shadow: true,
})
export class ScLineItemTax {
  @Prop() order: Checkout;
  @Prop() loading: boolean;

  renderLabel() {
    let label = sprintf(__('Estimated %s', 'surecart'), this?.order?.tax_label || '');

    if (this?.order?.tax_status === 'calculated') {
      label = this.order?.tax_label ||'';
    }


    return (
      <Fragment>
        {`${__('Tax:', 'surecart')} ${label}`}
        {this.renderPercent()}
      </Fragment>
    );
  }

  renderPercent() {
    if (this.order?.tax_percent) {
      return (
        <Fragment>
          {'('}
          {this.order.tax_percent}%{')'}
        </Fragment>
      );
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

        {this.order?.tax_exclusive_amount && (
          <span slot="price">
            <sc-format-number type="currency" currency={this?.order?.currency || 'usd'} value={this?.order?.tax_exclusive_amount} />
          </span>
        )}

        {this.order?.tax_inclusive_amount && (
          <span slot="price-description">
            {'('}
            <sc-format-number type="currency" currency={this?.order?.currency || 'usd'} value={this?.order?.tax_inclusive_amount} /> {__('included', 'surecart')}
            {')'}
          </span>
        )}
      </sc-line-item>
    );
  }
}

openWormhole(ScLineItemTax, ['order', 'loading'], false);
