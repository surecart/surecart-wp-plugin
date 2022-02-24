import { Component, h, Prop, State, Watch } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';
import { hasState, hasCity, hasPostal, countryChoices } from '../../../functions/address';
import { Address } from '../../../types';

@Component({
  tag: 'ce-address',
  styleUrl: 'ce-address.scss',
  scoped: true,
})
export class CeAddress {
  /** Customer shipping address. */
  @Prop() customerShippingAddress: Address = {};

  /** The order's shipping address. */
  @Prop() shippingAddress: Address = {};

  /** Is this loading?  */
  @Prop() loading: boolean = true;

  /** The label for the field. */
  @Prop() label: string;

  /** Is this required? */
  @Prop({ reflect: true }) required: boolean = true;

  /** Internal state. */
  @State() state: Partial<Address> = {
    country: '',
    city: '',
    line_1: '',
    line_2: '',
    postal_code: '',
    state: '',
  };

  /** Should we show the city field? */
  @State() showCity: boolean = true;

  /** Should we show the postal field? */
  @State() showPostal: boolean = true;

  /** Holds the regions for a given country. */
  @State() regions: Array<{ value: string; label: string }>;

  /** Holds our country choices. */
  @State() countryChoices: Array<{ value: string; label: string }> = countryChoices;

  /** When the state changes, we want to update city and postal fields. */
  @Watch('state')
  handleCountryChange(val, old) {
    this.setRegions();
    this.showPostal = hasPostal(this.state.country);
    this.showCity = hasCity(this.state.country);

    if (old?.country && val?.country && val?.country !== old?.country) {
      this.state = {
        country: val.country,
      };
    }
  }

  /** When the shipping address changes, we want to update the internal state to match. */
  @Watch('shippingAddress')
  handleShippingChange(val, old) {
    // update local state if changes.
    Object.keys(this.state).forEach(key => {
      if (val?.[key] !== old?.[key]) {
        if (!val?.[key]) return; // don't allow resetting to empty.
        this.state = { ...this.state, [key]: val?.[key] };
      }
    });
  }

  /** When the customer shipping address changes, we want to update the internal state to match. */
  @Watch('customerShippingAddress')
  handleCustomerShippingChange(val, old) {
    if (!Object.keys(this.shippingAddress || {}).length) {
      // update local state if changes.
      Object.keys(this.state).forEach(key => {
        if (val?.[key] !== old?.[key]) {
          if (!val?.[key]) return; // don't allow resetting to empty.
          this.state = { ...this.state, [key]: val?.[key] };
        }
      });
    }
  }

  /** Set the regions based on the country. */
  setRegions() {
    if (hasState(this.state.country)) {
      import('./countries.json').then(module => {
        this.regions = module?.[this.state.country] as Array<{ value: string; label: string }>;
      });
    } else {
      this.regions = [];
    }
  }

  componentWillLoad() {
    // if we have a shipping address, update the state.
    if (this.shippingAddress) {
      this.state = {
        ...(this.shippingAddress.state ? { state: this.shippingAddress.state } : {}),
        ...(this.shippingAddress.city ? { city: this.shippingAddress.city } : {}),
        ...(this.shippingAddress.postal_code ? { postal_code: this.shippingAddress.postal_code } : {}),
        ...(this.shippingAddress.line_1 ? { line_1: this.shippingAddress.line_1 } : {}),
      };
    }
    if (!this.state.country) {
      this.setRegionByBrowserLanguage();
    }
  }

  /** Set the region by browser language if not set. */
  setRegionByBrowserLanguage() {
    const country = navigator?.language?.slice(-2);
    if (country) {
      this.state.country = country;
      this.setRegions();
    }
  }

  render() {
    return (
      <div class="ce-address">
        <ce-form-control label={this.label} class="ce-address__control" part="control" required={this.required}>
          <ce-select
            placeholder={__('Country', 'checkout_engine')}
            choices={this.countryChoices}
            autocomplete={'country-name'}
            onCeChange={e => (this.state = { ...this.state, country: (e.target as any).value })}
            value={this?.state?.country}
            name="shipping_country"
            search
            squared-bottom
            required={this.required}
          />

          <ce-input
            value={this?.state?.line_1}
            autocomplete="street-address"
            placeholder={__('Address', 'checkout_engine')}
            name="shipping_line_1"
            squared
            required={this.required}
          />

          <div class="ce-address__columns">
            <ce-input
              placeholder={__('City', 'checkout_engine')}
              name="shipping_city"
              value={this?.state?.city}
              required={this.required && this.showCity}
              hidden={!this.showCity}
              squared={!!this?.regions?.length}
              style={{ marginRight: this.showPostal ? '-1px' : '0' }}
              squared-top
              squared-right={this.showPostal}
            />
            <ce-input
              placeholder={__('Postal Code/Zip', 'checkout_engine')}
              name="shipping_postal_code"
              autocomplete={'postal-code'}
              required={this.required && this.showPostal}
              hidden={!this.showPostal}
              value={this?.state?.postal_code}
              squared={!!this?.regions?.length}
              squared-top
              squared-left={this.showCity}
            />
          </div>

          <ce-select
            placeholder={__('State/Province/Region', 'checkout_engine')}
            name="shipping_state"
            autocomplete={'address-level1'}
            value={this?.state?.state}
            choices={this.regions}
            required={this.required && !!this?.regions?.length}
            hidden={!this?.regions?.length}
            search
            squared-top
          />
        </ce-form-control>
      </div>
    );
  }
}

openWormhole(CeAddress, ['shippingAddress', 'loading', 'customerShippingAddress'], false);
