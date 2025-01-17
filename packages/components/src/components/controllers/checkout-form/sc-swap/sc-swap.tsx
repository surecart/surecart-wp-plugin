import { Component, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { LineItem, Checkout } from 'src/types';
import apiFetch from '../../../../functions/fetch';
import { state as checkoutState } from '@store/checkout';
import { createOrUpdateCheckout } from '../../../../services/session';
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
        await apiFetch({
            path: `/surecart/v1/line_items/${this.lineItem?.id}/${e.target.checked ? 'swap' : 'unswap'}`,
            method: 'PATCH',
        });

        checkoutState.checkout = (await createOrUpdateCheckout({
            id: checkoutState.checkout.id,
            data: {
              refresh_line_items: true,
            },
        })) as Checkout;
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
