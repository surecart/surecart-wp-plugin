import { Component, Fragment, h, Method, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { Address, Checkout } from '../../../../types';
import { state as checkoutState, onChange } from '@store/checkout';
import { formLoading } from '@store/form/getters';
import { lockCheckout, unLockCheckout } from '@store/checkout/mutations';
import { createOrUpdateCheckout } from '@services/session';
import { ScCheckboxCustomEvent } from 'src/components';
import { state as userState, onChange as onUserChange } from '@store/user';
import { fetchCustomerAddresses, clearCustomerAddressCache } from '../../../../services/customer-address';

@Component({
  tag: 'sc-order-billing-address',
  styleUrl: 'sc-order-billing-address.scss',
  shadow: true,
})
export class ScOrderBillingAddress {
  /** The input */
  private input: HTMLScAddressElement | HTMLScCompactAddressElement;

  /** Label for the field */
  @Prop() label: string;

  /** Show the name field */
  @Prop({ reflect: true }) showName: boolean;

  /** Name placeholder */
  @Prop() namePlaceholder: string = __('Name or Company Name', 'surecart');

  /** Default country for address */
  @Prop() defaultCountry: string;

  /** Toggle label */
  @Prop() toggleLabel: string = __('Billing address is same as shipping', 'surecart');

  /** Address to pass to the component */
  @State() address: Partial<Address> = {
    country: null,
    city: null,
    line_1: null,
    line_2: null,
    postal_code: null,
    state: null,
  };

  @Method()
  async reportValidity() {
    if (!this.input) return true;
    return this.input?.reportValidity?.();
  }

  /** Check if all address fields (except country) are empty. */
  isAddressEmpty() {
    const addressKeys = Object.keys(this.address).filter(key => key !== 'country');
    return addressKeys.every(key => !this.address[key]);
  }

  prefillAddress() {
    // check if address keys are empty, if so, update them.
    if (this.isAddressEmpty()) {
      this.address = { ...this.address, ...(checkoutState.checkout?.billing_address as Address) };
    }
  }

  /** Fetch and prefill billing address from customer profile if user is logged in. */
  async prefillFromCustomerProfile() {
    if (!userState.loggedIn) return;
    if (!this.isAddressEmpty()) return;

    try {
      const data = await fetchCustomerAddresses(checkoutState.mode);
      const billingAddress = data?.billing_address;

      // Only prefill local UI state. The shipping component handles the checkout API update
      // with both addresses to avoid race conditions.
      if (billingAddress && !Array.isArray(billingAddress) && Object.keys(billingAddress).length && this.isAddressEmpty()) {
        this.address = { ...this.address, ...billingAddress };
      }
    } catch (e) {
      // Silently fail — auto-fill is a convenience feature.
      console.error(e);
    }
  }

  componentWillLoad() {
    if (this.defaultCountry && !this.address?.country) {
      this.address.country = this.defaultCountry;
    }

    this.prefillAddress();
    onChange('checkout', () => this.prefillAddress());

    // Fetch customer address from API for logged-in users.
    this.prefillFromCustomerProfile();

    // Also fetch when user logs in mid-checkout.
    onUserChange('loggedIn', loggedIn => {
      if (loggedIn) {
        clearCustomerAddressCache();
        this.prefillFromCustomerProfile();
      }
    });
  }

  async updateAddressState(address: Partial<Address>) {
    if (JSON.stringify(address) === JSON.stringify(this.address)) return; // no change, don't update.
    this.address = address;
    try {
      lockCheckout('billing-address');
      checkoutState.checkout = (await createOrUpdateCheckout({
        id: checkoutState?.checkout?.id,
        data: {
          billing_matches_shipping: checkoutState.checkout?.billing_matches_shipping,
          billing_address: this.address as Address,
        },
      })) as Checkout;
    } catch (e) {
      console.error(e);
    } finally {
      unLockCheckout('billing-address');
    }
  }

  async onToggleBillingMatchesShipping(e: ScCheckboxCustomEvent<void>) {
    checkoutState.checkout = {
      ...checkoutState.checkout,
      billing_matches_shipping: e.target.checked,
    };
  }

  shippingAddressFieldExists() {
    return !!document.querySelector('sc-order-shipping-address');
  }

  render() {
    return (
      <Fragment>
        {/* Only display this toggle if there is a shipping address. */}
        {this.shippingAddressFieldExists() && (
          <sc-checkbox class="order-billing-address__toggle" onScChange={e => this.onToggleBillingMatchesShipping(e)} checked={checkoutState.checkout?.billing_matches_shipping}>
            {this.toggleLabel}
          </sc-checkbox>
        )}

        {/* If the shipping address field does not exist, always display this field. */}
        {(!this.shippingAddressFieldExists() || !checkoutState.checkout?.billing_matches_shipping) && (
          <sc-address
            exportparts="label, help-text, form-control, input__base, select__base, columns, search__base, menu__base"
            ref={el => {
              this.input = el;
            }}
            label={this.label || __('Billing Address', 'surecart')}
            names={{
              name: 'billing_name',
              country: 'billing_country',
              city: 'billing_city',
              line_1: 'billing_line_1',
              line_2: 'billing_line_2',
              postal_code: 'billing_postal_code',
              state: 'billing_state',
            }}
            required={true}
            loading={formLoading()}
            address={this.address}
            show-name={this.showName}
            onScChangeAddress={e => this.updateAddressState(e.detail)}
          />
        )}
      </Fragment>
    );
  }
}
