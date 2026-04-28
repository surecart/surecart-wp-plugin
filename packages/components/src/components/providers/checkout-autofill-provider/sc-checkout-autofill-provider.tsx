import { Component, h, Host } from '@stencil/core';
import { state as checkoutState, onChange as onCheckoutChange } from '@store/checkout';
import { lockCheckout, unLockCheckout } from '@store/checkout/mutations';
import { state as userState, onChange as onUserChange } from '@store/user';
import { Address, Checkout } from '../../../types';
import { createOrUpdateCheckout } from '../../../services/session';
import { getCurrentCustomer, hasAddressData, isAddressEmpty } from '../../../services/customer-address';

@Component({
  tag: 'sc-checkout-autofill-provider',
  shadow: true,
})
export class ScCheckoutAutofillProvider {
  private appliedForCheckoutId?: string;
  private removeUserListener?: () => void;
  private removeCheckoutListener?: () => void;

  componentWillLoad() {
    this.maybeApplyProfile();
    this.removeUserListener = onUserChange('loggedIn', loggedIn => {
      if (!loggedIn) {
        // A later login on the same checkout should re-apply.
        this.appliedForCheckoutId = undefined;
        return;
      }
      this.maybeApplyProfile();
    });
    this.removeCheckoutListener = onCheckoutChange('checkout', () => this.maybeApplyProfile());
  }

  disconnectedCallback() {
    this.removeUserListener?.();
    this.removeCheckoutListener?.();
  }

  async maybeApplyProfile() {
    if (!userState.loggedIn) return;

    const checkoutId = checkoutState.checkout?.id;
    if (!checkoutId) return;
    if (this.appliedForCheckoutId === checkoutId) return;

    this.appliedForCheckoutId = checkoutId;

    try {
      const customer = await getCurrentCustomer(checkoutState.mode);
      const patch: Record<string, any> = {};

      // The shipping/billing fields on Customer are typed as `string | Address`; here they
      // are expanded into Address objects via the `expand` param, so this cast is safe.
      const shippingAddress = customer?.shipping_address as Address | [] | undefined;
      const billingAddress = customer?.billing_address as Address | [] | undefined;

      if (hasAddressData(shippingAddress) && isAddressEmpty(checkoutState.checkout?.shipping_address)) {
        patch.shipping_address = shippingAddress;
      }
      if (hasAddressData(billingAddress) && isAddressEmpty(checkoutState.checkout?.billing_address)) {
        patch.billing_address = billingAddress;
      }
      if (customer?.first_name && !checkoutState.checkout?.first_name) {
        patch.first_name = customer.first_name;
      }
      if (customer?.last_name && !checkoutState.checkout?.last_name) {
        patch.last_name = customer.last_name;
      }
      if (customer?.phone && !checkoutState.checkout?.phone) {
        patch.phone = customer.phone;
      }

      // Nothing to apply — skip the lock entirely.
      if (!Object.keys(patch).length) return;

      lockCheckout('customer-profile-autofill');
      try {
        checkoutState.checkout = (await createOrUpdateCheckout({ id: checkoutState.checkout?.id, data: patch })) as Checkout;
      } finally {
        unLockCheckout('customer-profile-autofill');
      }
    } catch (e) {
      // Convenience feature — don't block checkout; clear the flag so a later trigger can retry.
      this.appliedForCheckoutId = undefined;
      console.error(e);
    }
  }

  render() {
    return (
      <Host>
        <slot />
      </Host>
    );
  }
}
