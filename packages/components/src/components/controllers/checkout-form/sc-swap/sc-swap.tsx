import { Component, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { LineItem } from 'src/types';
import { state as checkoutState } from '@store/checkout';
import { toggleSwap } from '@services/session';
import { updateFormState } from '@store/form/mutations';

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
        console.error(e);
    }

  }

  render() {
    if(!this?.lineItem?.price?.current_swap && !this?.lineItem?.swap) {
        return null;
    }

    const swap = this?.lineItem?.swap || this?.lineItem?.price?.current_swap;

    return (
        <sc-switch checked={!!this?.lineItem?.swap} onScChange={(e) => this.onSwapToggleChange(e)}>
            {swap?.description}
        </sc-switch>
    );
  }
}
