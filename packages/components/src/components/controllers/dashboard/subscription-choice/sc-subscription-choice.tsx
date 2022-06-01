import { Component, Fragment, h, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { intervalString } from '../../../../functions/price';
import { Price, Product } from '../../../../types';

@Component({
  tag: 'sc-subscription-choice',
  styleUrl: 'sc-subscription-choice.scss',
  shadow: false,
})
export class ScSubscriptionChoice {
  @Prop() price: Price;
  @Prop() product: Product;
  @Prop() amount: number = 0;
  @Prop() isCurrent: boolean;
  @Prop() isHidden: boolean;
  @State() dialog: boolean;

  getAmount() {
    if (this.price?.ad_hoc) {
      return `${__('Custom amount', 'surecart')} ${intervalString(this.price)}`;
    }

    return (
      <Fragment>
        <sc-format-number type="currency" currency={this.price?.currency || 'usd'} value={this.price?.amount}></sc-format-number> {intervalString(this.price, { showOnce: true })}
      </Fragment>
    );
  }

  render() {
    return (
      <Fragment>
        <sc-choice key={this.price?.id} checked={this.isCurrent} name="plan" value={this.price?.id} hidden={this.isHidden}>
          <div>
            <strong>{this.product?.name}</strong>
          </div>
          <div slot="description">{this.getAmount()}</div>
          {this.isCurrent && (
            <sc-tag type="warning" slot="price">
              {__('Current Plan', 'surecart')}
            </sc-tag>
          )}
        </sc-choice>
      </Fragment>
    );
  }
}
