import { Component, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { LineItem, Price } from '../../../../types';
import { state as checkoutState } from '@store/checkout';
import { toggleSwap } from '@services/session';
import { updateFormState } from '@store/form/mutations';
import { createErrorNotice } from '@store/notices/mutations';

@Component({
  tag: 'sc-swap',
  styleUrl: 'sc-swap.scss',
  shadow: true,
})
export class ScSwap {
  /** The product id. */
  @Prop() lineItem: LineItem;

  async onSwapToggleChange(e) {
    try {
      updateFormState('FETCH');
      checkoutState.checkout = await toggleSwap({ id: this.lineItem?.id, action: e.target.checked ? 'swap' : 'unswap' });
      updateFormState('RESOLVE');
    } catch (e) {
      updateFormState('REJECT');
      createErrorNotice(e.message);
      console.error(e);
    }
  }

  render() {
    if (!this?.lineItem?.price?.current_swap && !this?.lineItem?.swap) {
      return null;
    }

    const swap = this?.lineItem?.swap || this?.lineItem?.price?.current_swap;
    const price = swap?.swap_price as Price;

    return (
      <div class="swap">
        <sc-switch checked={!!this?.lineItem?.swap} onScChange={e => this.onSwapToggleChange(e)}>
          {swap?.description}
        </sc-switch>
        {!!price?.display_amount && (
          <div class="sc-swap__price">
            {(swap?.swap_price as Price)?.display_amount} {price?.short_interval_text} {price?.interval_count_text}
          </div>
        )}
      </div>
    );
  }
}
