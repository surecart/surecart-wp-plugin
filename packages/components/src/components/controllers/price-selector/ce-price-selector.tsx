import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';
import { isPriceInCheckoutSession } from '../../../functions/line-items';
import { CheckoutSession, ChoiceType, LineItemData, PriceChoice, Prices, Product } from '../../../types';

@Component({
  tag: 'ce-price-selector',
  styleUrl: 'ce-price-selector.css',
  shadow: true,
})
export class CePriceSelector {
  choicesRef: HTMLCeChoicesElement;

  /** Selector label */
  @Prop() label: string;

  /** Number of columns */
  @Prop() columns: number;

  /** Choices to choose from */
  @Prop() choices: Array<PriceChoice>;

  /** ChoiceType */
  @Prop() choiceType: ChoiceType = 'all';

  /** Price entities */
  @Prop() prices: Prices;

  /** Product entity */
  @Prop() product: Product;

  /** The current checkout session. */
  @Prop() checkoutSession: CheckoutSession;

  /** Toggle line item event */
  @Event() ceToggleLineItem: EventEmitter<LineItemData>;

  render() {
    return (
      <ce-choices ref={el => (this.choicesRef = el)} label={this.label} class="loaded price-selector" style={{ '--columns': this.columns.toString() }}>
        {this.choices.map(choice => {
          const price = this.prices?.[choice?.id];
          if (!price || price.archived) return;
          return (
            <ce-choice
              class="loaded"
              value={price.id}
              type={this.choiceType === 'multiple' ? 'checkbox' : 'radio'}
              onCeChange={() => {
                this.ceToggleLineItem.emit({ price_id: choice.id, quantity: choice.quantity });
              }}
              checked={isPriceInCheckoutSession(price, this.checkoutSession)}
            >
              {price.name}
              <span slot="price">
                <ce-format-number type="currency" value={price.amount} currency={price.currency}></ce-format-number>
              </span>
              <span slot="per">{price.recurring_interval ? `/ ${price.recurring_interval}` : `once`}</span>
            </ce-choice>
          );
        })}
      </ce-choices>
    );
  }
}

openWormhole(CePriceSelector, ['products', 'prices', 'loading', 'choiceType', 'checkoutSession'], false);
