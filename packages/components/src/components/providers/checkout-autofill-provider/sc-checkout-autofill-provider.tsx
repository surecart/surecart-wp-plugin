import { Component, h, Host } from '@stencil/core';
import { state as checkoutState, onChange as onCheckoutChange } from '@store/checkout';
import { lockCheckout, unLockCheckout } from '@store/checkout/mutations';
import { state as userState, onChange as onUserChange } from '@store/user';
import { Checkout } from '../../../types';
import { createOrUpdateCheckout } from '../../../services/session';
import { getCustomerAddresses, hasAddressData, isAddressEmpty } from '../../../services/customer-address';

/**
 * Headless provider: when a logged-in user is on a draft checkout, fetches the
 * customer's saved profile (shipping/billing address, name, phone) and patches the
 * draft checkout with any fields that aren't already set. Runs at most once per
 * checkout id. Address and name components read the patched values from
 * `checkoutState.checkout` via their own subscriptions — this provider doesn't
 * touch component state directly.
 */
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
      const data = await getCustomerAddresses(checkoutState.mode);
      const patch: Record<string, any> = {};

      if (hasAddressData(data?.shipping_address) && isAddressEmpty(checkoutState.checkout?.shipping_address)) {
        patch.shipping_address = data.shipping_address;
      }
      if (hasAddressData(data?.billing_address) && isAddressEmpty(checkoutState.checkout?.billing_address)) {
        patch.billing_address = data.billing_address;
      }
      if (data?.first_name && !checkoutState.checkout?.first_name) {
        patch.first_name = data.first_name;
      }
      if (data?.last_name && !checkoutState.checkout?.last_name) {
        patch.last_name = data.last_name;
      }
      if (data?.phone && !checkoutState.checkout?.phone) {
        patch.phone = data.phone;
      }

      if (!Object.keys(patch).length) return;

      lockCheckout('customer-profile-autofill');
      checkoutState.checkout = (await createOrUpdateCheckout({ id: checkoutId, data: patch })) as Checkout;
    } catch (e) {
      // Convenience feature — don't block checkout; clear the flag so a later trigger can retry.
      this.appliedForCheckoutId = null;
      console.error(e);
    } finally {
      unLockCheckout('customer-profile-autofill');
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
