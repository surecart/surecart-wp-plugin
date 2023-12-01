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
  @Prop() showControl: boolean;
  @Prop() help: string;

  render() {
    if (!checkoutState?.checkout?.recommended_bumps?.data?.length) {
      return null;
    }

    return (
      <sc-form-control label={this.label || __('Recommended', 'surecart')} help={this.help}>
        <div class="bumps__list" aria-label={__('Order bump summary', 'surecart')}>
          {(checkoutState?.checkout?.recommended_bumps?.data || [])
            .filter(bump => ((bump?.price as Price)?.product as Product)?.variants?.pagination?.count === 0) // exclude variants for now.
            .map(bump => (
              <sc-order-bump key={bump?.id} showControl={this.showControl} bump={bump} />
            ))}
        </div>
      </sc-form-control>
    );
  }
}
