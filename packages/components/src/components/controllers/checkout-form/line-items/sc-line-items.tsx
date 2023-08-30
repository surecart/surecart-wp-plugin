import { Component, Event, EventEmitter, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';

import { hasSubscription } from '../../../../functions/line-items';
import { intervalString } from '../../../../functions/price';
import { LineItem, LineItemData, Checkout, PriceChoice, Prices, Product } from '../../../../types';

/**
 * @part base - The component base
 * @part line-item - The line item
 * @part product-line-item - The product line item
 * @part line-item__image - The line item image
 * @part line-item__text - The line item text
 * @part line-item__title - The line item title
 * @part line-item__suffix - The line item suffix
 * @part line-item__price - The line item price
 * @part line-item__price-amount - The line item price amount
 * @part line-item__price-description - The line item price description
 * @part line-item__price-scratch - The line item price scratch
 * @part line-item__static-quantity - The line item static quantity
 * @part line-item__remove-icon - The line item remove icon
 * @part line-item__quantity - The line item quantity
 * @part line-item__quantity-minus - The line item quantity minus
 * @part line-item__quantity-minus-icon - The line item quantity minus icon
 * @part line-item__quantity-plus - The line item quantity plus
 * @part line-item__quantity-plus-icon - The line item quantity plus icon
 * @part line-item__quantity-input - The line item quantity input
 * @part line-item__price-description - The line item price description
 */

@Component({
  tag: 'sc-line-items',
  styleUrl: 'sc-line-items.css',
  shadow: true,
})
export class ScLineItems {
  @Prop() order: Checkout;
  @Prop() busy: boolean;
  @Prop() prices: Prices;
  @Prop() editable: boolean;
  @Prop() removable: boolean;
  @Prop() editLineItems: boolean = true;
  @Prop() removeLineItems: boolean = true;
  @Prop() lockedChoices: Array<PriceChoice> = [];

  /** Update the line item. */
  @Event() scUpdateLineItem: EventEmitter<LineItemData>;

  /** Remove the line item. */
  @Event() scRemoveLineItem: EventEmitter<LineItemData>;

  /** Update quantity for this line item. */
  updateQuantity(item: LineItem, quantity: number) {
    this.scUpdateLineItem.emit({ id: item.id, price_id: item.price.id, quantity });
  }

  removeLineItem(item: LineItem) {
    this.scRemoveLineItem.emit({ id: item.id, price_id: item.price.id, quantity: 1 });
  }

  /** Only append price name if there's more than one product price in the session. */
  getName(item: LineItem) {
    const otherPrices = Object.keys(this.prices || {}).filter(key => {
      const price = this.prices[key];
      // @ts-ignore
      return price.product === item.price.product.id;
    });

    let name = '';
    if (otherPrices.length > 1) {
      name = `${(item?.price?.product as Product)?.name} \u2013 ${item?.price?.name}`;
    } else {
      name = (item?.price?.product as Product)?.name;
    }
    return name;
  }

  // Is this price choice locked?
  isLocked(item) {
    return this.lockedChoices.some(choice => choice.id === item.price.id);
  }

  isEditable(item: LineItem) {
    // ad hoc prices cannot have quantity.
    if (item?.price?.ad_hoc) {
      return false;
    }

    // if the item has a bump amount, it cannot have quantity.
    if (item?.bump_amount) {
      return false;
    }

    if (this.editable !== null) return this.editable;
    return this.editLineItems;
  }

  isRemovable() {
    if (this.removable !== null) return this.removable;
    return this.removeLineItems;
  }

  render() {
    if (!!this.busy && !this.order?.line_items?.data?.length) {
      return (
        <sc-line-item>
          <sc-skeleton style={{ 'width': '50px', 'height': '50px', '--border-radius': '0' }} slot="image"></sc-skeleton>
          <sc-skeleton slot="title" style={{ width: '120px', display: 'inline-block' }}></sc-skeleton>
          <sc-skeleton slot="description" style={{ width: '60px', display: 'inline-block' }}></sc-skeleton>
          <sc-skeleton style={{ width: '120px', display: 'inline-block' }} slot="price"></sc-skeleton>
          <sc-skeleton style={{ width: '60px', display: 'inline-block' }} slot="price-description"></sc-skeleton>
        </sc-line-item>
      );
    }

    return (
      <div class="line-items" part="base">
        {(this.order?.line_items?.data || []).map(item => {
          return (
            <div class="line-item">
              <sc-product-line-item
                key={item.id}
                imageUrl={(item?.price?.product as Product)?.image_url}
                name={(item?.price?.product as Product)?.name}
                max={(item?.price?.product as Product)?.purchase_limit}
                editable={this.isEditable(item)}
                removable={this.isRemovable()}
                quantity={item.quantity}
                fees={item?.fees?.data}
                setupFeeTrialEnabled={item?.price?.setup_fee_trial_enabled}
                amount={item.ad_hoc_amount !== null ? item.ad_hoc_amount : item.subtotal_amount}
                scratchAmount={item.ad_hoc_amount == null && item?.scratch_amount}
                currency={this.order?.currency}
                trialDurationDays={item?.price?.trial_duration_days}
                interval={!!item?.price && intervalString(item?.price, { showOnce: hasSubscription(this.order) })}
                onScUpdateQuantity={e => this.updateQuantity(item, e.detail)}
                onScRemove={() => this.removeLineItem(item)}
                exportparts="base:line-item, product-line-item, image:line-item__image, text:line-item__text, title:line-item__title, suffix:line-item__suffix, price:line-item__price, price__amount:line-item__price-amount, price__description:line-item__price-description, price__scratch:line-item__price-scratch, static-quantity:line-item__static-quantity, remove-icon__base:line-item__remove-icon, quantity:line-item__quantity, quantity__minus:line-item__quantity-minus, quantity__minus-icon:line-item__quantity-minus-icon, quantity__plus:line-item__quantity-plus, quantity__plus-icon:line-item__quantity-plus-icon, quantity__input:line-item__quantity-input, line-item__price-description:line-item__price-description"
              />
            </div>
          );
        })}
      </div>
    );
  }
}

openWormhole(ScLineItems, ['order', 'busy', 'prices', 'lockedChoices', 'editLineItems', 'removeLineItems'], false);
