import { Component, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { state as checkoutState } from '@store/checkout';
import { Price, Product } from '../../../../types';

@Component({
  tag: 'sc-order-bumps',
  styleUrl: 'sc-order-bumps.scss',
  shadow: true,
})
export class ScOrderBumps {
  @Prop() label: string;
  @Prop() help: string;

  /** Should we show the controls (classic design) */
  @Prop() showControl: boolean;

  /** Hide bumps that have already been added to the checkout. */
  @Prop() hideAddedItems: boolean;

  /** Check if a bump is already added as a line item. */
  isBumpAdded(bumpId: string) {
    return (checkoutState?.checkout?.line_items?.data || []).some(item => item?.bump === bumpId);
  }

  render() {
    const bumps = (checkoutState?.checkout?.recommended_bumps?.data || []).filter(bump => {
      // exclude variants for now.
      if (((bump?.price as Price)?.product as Product)?.variants?.pagination?.count !== 0) {
        return false;
      }
      // optionally exclude bumps already added to the checkout.
      if (this.hideAddedItems && this.isBumpAdded(bump?.id)) {
        return false;
      }
      return true;
    });

    if (!bumps?.length) {
      return null;
    }

    return (
      <sc-form-control label={this.label || __('Recommended', 'surecart')} help={this.help}>
        <div class="bumps__list" aria-label={__('Order bump summary', 'surecart')}>
          {bumps.map(bump => (
            <sc-order-bump key={bump?.id} bump={bump} showControl={this.showControl} exportparts="choice__base, choice__content, base-content, image, text, title, cta, amount, price, tag, description, button, base, control, checked-icon" />
          ))}
        </div>
      </sc-form-control>
    );
  }
}
