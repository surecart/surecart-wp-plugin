import { Component, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';

import { state as checkoutState } from '@store/checkout';
import { LineItem, Product, Variant } from '../../../../types';
import { removeCheckoutLineItem, updateCheckoutLineItem } from '@store/checkout/mutations';
import { formBusy } from '@store/form/getters';
import { getMaxStockQuantity } from '../../../../functions/quantity';

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
  styleUrl: 'sc-line-items.scss',
  shadow: true,
})
export class ScLineItems {
  /**
   * Is the line item editable?
   */
  @Prop() editable: boolean;

  /**
   * Is the line item removable?
   */
  @Prop() removable: boolean;

  /**
   * Is the line item editable?
   */
  isEditable(item: LineItem) {
    // ad_hoc prices and bumps cannot have quantity.
    if (item?.price?.ad_hoc || item?.bump_amount || item?.locked) {
      return false;
    }
    return this.editable;
  }

  render() {
    if (!!formBusy() && !checkoutState?.checkout?.line_items?.data?.length) {
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

    // Sort items so that items with swaps are at the top.
    const sortedItems = (checkoutState?.checkout?.line_items?.data || []).sort((a, b) => {
      const aHasSwap = a?.price?.current_swap || a?.swap ? 1 : 0;
      const bHasSwap = b?.price?.current_swap || b?.swap ? 1 : 0;
      return bHasSwap - aHasSwap;
    });

    return (
      <div class="line-items" part="base" tabindex="0">
        {sortedItems.map(item => {
          const max = getMaxStockQuantity(item?.price?.product as Product, item?.variant as Variant);
          return (
            <div class={`line-item ${item?.price?.current_swap || item?.swap ? 'line-item--has-swap' : ''}`}>
              <sc-product-line-item
                key={item.id}
                image={item?.image}
                name={(item?.price?.product as Product)?.name}
                price={item?.price?.name}
                variant={item?.variant_display_options}
                fees={item?.fees?.data}
                amount={item.ad_hoc_display_amount ? item.ad_hoc_display_amount : item.subtotal_display_amount}
                scratch={!item.ad_hoc_display_amount && item?.scratch_display_amount}
                trial={item?.price?.trial_text}
                interval={`${item?.price?.short_interval_text} ${item?.price?.short_interval_count_text}`}
                quantity={item.quantity}
                purchasableStatus={item?.purchasable_status_display}
                {...(max ? { max } : {})}
                editable={this.isEditable(item)}
                removable={!item?.locked && this.removable}
                quantity={item.quantity}
                fees={item?.fees?.data}
                setupFeeTrialEnabled={item?.price?.setup_fee_trial_enabled}
                amount={item.ad_hoc_amount !== null ? item.ad_hoc_amount : item.subtotal_amount}
                scratchAmount={item.ad_hoc_amount == null && item?.scratch_amount}
                scratchDisplayAmount={item?.scratch_display_amount}
                currency={checkoutState?.checkout?.currency}
                displayAmount={item.ad_hoc_amount !== null ? item.ad_hoc_display_amount : item.subtotal_display_amount}
                trialDurationDays={item?.price?.trial_duration_days}
                interval={!!item?.price && intervalString(item?.price, { showOnce: hasSubscription(checkoutState?.checkout) })}
                onScUpdateQuantity={e => updateCheckoutLineItem({ id: item.id, data: { quantity: e.detail } })}
                onScRemove={() => removeCheckoutLineItem(item?.id)}
                exportparts="base:line-item, product-line-item, image:line-item__image, text:line-item__text, title:line-item__title, suffix:line-item__suffix, price:line-item__price, price__amount:line-item__price-amount, price__description:line-item__price-description, price__scratch:line-item__price-scratch, static-quantity:line-item__static-quantity, remove-icon__base:line-item__remove-icon, quantity:line-item__quantity, quantity__minus:line-item__quantity-minus, quantity__minus-icon:line-item__quantity-minus-icon, quantity__plus:line-item__quantity-plus, quantity__plus-icon:line-item__quantity-plus-icon, quantity__input:line-item__quantity-input, line-item__price-description:line-item__price-description"
              />
              <sc-swap lineItem={item} />
            </div>
          );
        })}
      </div>
    );
  }
}
