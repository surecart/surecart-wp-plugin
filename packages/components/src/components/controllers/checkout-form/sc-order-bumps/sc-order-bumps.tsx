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

  render() {
    const bumps = (checkoutState?.checkout?.recommended_bumps?.data || []).filter(bump => ((bump?.price as Price)?.product as Product)?.variants?.pagination?.count === 0); // exclude variants for now.;

    if (!bumps?.length) {
      return null;
    }

    return (
      <sc-form-control label={this.label || __('Recommended', 'surecart')} help={this.help}>
        <div class="bumps__list" aria-label={__('Order bump summary', 'surecart')}>
          {bumps.map(bump => (
            <sc-order-bump key={bump?.id} bump={bump} exportparts="choice__base, choice__content, base-content, image, text, title, cta, amount, price, tag, description, button" />
          ))}
        </div>
      </sc-form-control>
    );
  }
}
