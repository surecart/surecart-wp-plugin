import { Component, h, Method, Prop, State } from '@stencil/core';
import { state as checkoutState, onChange } from '@store/checkout';
import { lockCheckout, unLockCheckout } from '@store/checkout/mutations';
import { __ } from '@wordpress/i18n';
import { createOrUpdateCheckout } from '../../../../services/session';

import { Address, Checkout } from '../../../../types';
import { fullShippingAddressRequired, shippingAddressRequired } from '@store/checkout/getters';
import { formLoading } from '@store/form/getters';
import { state as userState, onChange as onUserChange } from '@store/user';
import { fetchCustomerAddresses, clearCustomerAddressCache } from '../../../../services/customer-address';

@Component({
  tag: 'sc-order-shipping-address',
  styleUrl: 'sc-order-shipping-address.scss',
  shadow: true,
})
export class ScOrderShippingAddress {
  private input: HTMLScAddressElement | HTMLScCompactAddressElement;

  /** Label for the field. */
  @Prop() label: string;

  /** Is this required (defaults to false) */
  @Prop({ mutable: true, reflect: true }) required: boolean = false;

  /** Show the address */
  @Prop({ mutable: true }) full: boolean;

  /** Show the name field. */
  @Prop({ reflect: true }) showName: boolean;

  /** Default country for address */
  @Prop() defaultCountry: string;

  /** Show the line 2 field. */
  @Prop({ reflect: true }) showLine2: boolean;

  /** Whether to require the name in the address */
  @Prop({ reflect: true }) requireName: boolean = false;

  /** Address to pass to the component */
  @State() address: Partial<Address> = {
    country: null,
    city: null,
    line_1: null,
    line_2: null,
    postal_code: null,
    state: null,
  };

  /** Names for the address */
  names = {
    name: 'shipping_name',
    country: 'shipping_country',
    city: 'shipping_city',
    line_1: 'shipping_line_1',
    line_2: 'shipping_line_2',
    postal_code: 'shipping_postal_code',
    state: 'shipping_state',
  };

  async updateAddressState(address: Partial<Address>) {
    if (JSON.stringify(address) === JSON.stringify(this.address)) return; // no change, don't update.
    this.address = address;
    try {
      lockCheckout('shipping-address');
      checkoutState.checkout = (await createOrUpdateCheckout({
        id: checkoutState.checkout?.id,
        data: {
          shipping_address: this.address as Address,
        },
      })) as Checkout;
    } catch (e) {
      console.error(e);
    } finally {
      unLockCheckout('shipping-address');
    }
  }

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
      this.address = { ...this.address, ...(checkoutState.checkout?.shipping_address as Address) };
    }
  }

  /** Fetch and prefill shipping address from customer profile if user is logged in. */
  async prefillFromCustomerProfile() {
    if (!userState.loggedIn) return;
    if (!this.isAddressEmpty()) return;

    try {
      const data = await fetchCustomerAddresses(checkoutState.mode);
      const shippingAddress = data?.shipping_address;

      // Only prefill if we got valid address data and fields are still empty.
      if (shippingAddress && !Array.isArray(shippingAddress) && Object.keys(shippingAddress).length && this.isAddressEmpty()) {
        this.address = { ...this.address, ...shippingAddress };

        // Update the checkout with all prefilled customer data (shipping, billing, name, phone).
        if (checkoutState.checkout?.id) {
          const billingAddress = data?.billing_address;
          lockCheckout('shipping-address');
          try {
            checkoutState.checkout = (await createOrUpdateCheckout({
              id: checkoutState.checkout.id,
              data: {
                shipping_address: this.address as Address,
                ...(billingAddress && !Array.isArray(billingAddress) && Object.keys(billingAddress).length ? { billing_address: billingAddress } : {}),
                ...(data.first_name ? { first_name: data.first_name } : {}),
                ...(data.last_name ? { last_name: data.last_name } : {}),
                ...(data.phone ? { phone: data.phone } : {}),
              },
            })) as Checkout;
          } finally {
            unLockCheckout('shipping-address');
          }
        }
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

  render() {
    // use full if checkout requires it, it's set, or we're showing/requiring name field.
    if (fullShippingAddressRequired() || this.full || this.requireName || this.showName) {
      return (
        <sc-address
          exportparts="label, help-text, form-control, input__base, select__base, columns, search__base, menu__base"
          ref={el => (this.input = el as any)}
          label={this.label || __('Shipping Address', 'surecart')}
          names={this.names}
          required={this.required || shippingAddressRequired()}
          loading={formLoading()}
          address={this.address}
          show-name={this.showName}
          require-name={this.requireName}
          show-line-2={this.showLine2}
          onScChangeAddress={e => this.updateAddressState(e.detail)}
        ></sc-address>
      );
    }
    return (
      <sc-compact-address
        ref={el => (this.input = el as any)}
        required={this.required || shippingAddressRequired()}
        loading={formLoading()}
        address={this.address}
        names={this.names}
        label={this.label}
        onScChangeAddress={e => this.updateAddressState(e.detail)}
      ></sc-compact-address>
    );
  }
}
