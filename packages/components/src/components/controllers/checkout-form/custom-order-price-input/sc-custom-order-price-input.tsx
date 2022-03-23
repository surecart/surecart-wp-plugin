import { Component, h, Prop } from '@stencil/core';
import { Price } from '../../../../types';
import { openWormhole } from 'stencil-wormhole';

@Component({
  tag: 'sc-custom-order-price-input',
  styleUrl: 'sc-custom-order-price-input.css',
  shadow: false,
})
export class ScCustomOrderPriceInput {
  /** Id of the price. */
  @Prop({ reflect: true }) priceId: string;

  /** Stores the price */
  @Prop({ mutable: true }) price: Price;

  /** Is this loading */
  @Prop({ mutable: true }) loading: boolean = false;

  /** Label for the choice. */
  @Prop() label: string;

  /** Help text. */
  @Prop() help: string;

  render() {
    if (this.loading) {
      return (
        <div>
          <sc-skeleton style={{ width: '20%', marginBottom: '0.75em' }}></sc-skeleton>
          <sc-skeleton style={{ width: '100%' }}></sc-skeleton>
        </div>
      );
    }

    return (
      <sc-price-input
        currency-code={this.price?.currency || 'usd'}
        label={this.label}
        min={this?.price?.ad_hoc_min_amount}
        max={this?.price?.ad_hoc_max_amount}
        help={this.help}
      ></sc-price-input>
    );
  }
}

openWormhole(ScCustomOrderPriceInput, ['loading'], false);
