import { Component, h, Prop, State, Watch } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';

import { hasState, hasCity, hasPostal, countryChoices } from '../../../functions/address';
import { Address } from '../../../types';

@Component({
  tag: 'ce-address',
  styleUrl: 'ce-address.scss',
  shadow: false,
})
export class CeAddress {
  @Prop() shippingAddress: Address;
  @Prop() loading: boolean;
  @Prop() busy: boolean;
  @Prop() label: string;
  @Prop() required: boolean = true;

  @State() state: Partial<Address> = {
    country: '',
    city: '',
    line_1: '',
    line_2: '',
    postal_code: '',
    state: '',
  };
  @State() showCity: boolean = true;
  @State() showPostal: boolean = true;
  @State() regions: Array<{ value: string; label: string }>;
  @State() countryChoices: Array<{ value: string; label: string }> = countryChoices;

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

  setRegions() {
    if (hasState(this.state.country)) {
      import('./countries.json').then(module => {
        this.regions = module?.[this.state.country] as Array<{ value: string; label: string }>;
      });
    } else {
      this.regions = [];
    }
  }
  renderCityPostal() {
    if (!this.showCity) {
      return (
        <ce-input
          placeholder={__('Postal Code/Zip', 'checkout_engine')}
          name="shipping_city"
          value={this?.state?.city}
          required={this.required}
          squared={!!this?.regions?.length}
          squared-top
        />
      );
    }
    if (!this.showPostal) {
      return (
        <ce-input
          placeholder={__('City', 'checkout_engine')}
          name="shipping_postal_code"
          value={this?.state?.postal_code}
          required={this.required}
          squared={!!this?.regions?.length}
          squared-top
        />
      );
    }

    return (
      <div class="ce-address__columns">
        <ce-input
          placeholder={__('City', 'checkout_engine')}
          name="shipping_city"
          value={this?.state?.city}
          required={this.required}
          squared={!!this?.regions?.length}
          squared-top
          squared-right
        />
        <ce-input
          placeholder={__('Postal Code/Zip', 'checkout_engine')}
          name="shipping_postal_code"
          required={this.required}
          value={this?.state?.postal_code}
          squared={!!this?.regions?.length}
          squared-top
          squared-left
        />
      </div>
    );
  }

  componentWillLoad() {
    if (this.shippingAddress) {
      this.state = {
        ...(this.shippingAddress.state ? { state: this.shippingAddress.state } : {}),
        ...(this.shippingAddress.city ? { city: this.shippingAddress.city } : {}),
        ...(this.shippingAddress.postal_code ? { postal_code: this.shippingAddress.postal_code } : {}),
        ...(this.shippingAddress.line_1 ? { line_1: this.shippingAddress.line_1 } : {}),
      };
    }
    if (!this.state.country) {
      const country = navigator.language.slice(-2);
      if (country) {
        this.state.country = country;
        this.setRegions();
      }
    }
  }

  render() {
    if (this.loading) {
      return (
        <div class="ce-address">
          <ce-form-control label={this.label} class="ce-address__control ce-address--loading" part="control">
            <ce-skeleton style={{ width: '50%' }}></ce-skeleton>
            <ce-skeleton style={{ width: '80%' }}></ce-skeleton>
            <ce-skeleton style={{ width: '40%' }}></ce-skeleton>
            <ce-skeleton style={{ width: '20%' }}></ce-skeleton>
          </ce-form-control>
        </div>
      );
    }

    return (
      <div class="ce-address">
        <ce-form-control label={this.label} class="ce-address__control" part="control" required={this.required}>
          <ce-select
            placeholder={__('Country', 'checkout_engine')}
            choices={this.countryChoices}
            onCeChange={e => (this.state = { ...this.state, country: (e.target as any).value })}
            value={this?.state?.country}
            name="shipping_country"
            search
            squared-bottom
            required={this.required}
          />
          <ce-input value={this?.state?.line_1} placeholder={__('Address', 'checkout_engine')} name="shipping_line_1" squared required={this.required} />
          {/* <ce-input value={this?.state?.line_2} placeholder={__('Address Line 2', 'checkout_engine')} name="shipping_line_2" squared /> */}
          {this.renderCityPostal()}
          {!!this?.regions?.length && (
            <ce-select
              placeholder={__('State/Province/Region', 'checkout_engine')}
              name="shipping_state"
              value={this?.state?.state}
              choices={this.regions}
              required={this.required}
              search
              squared-top
            />
          )}
        </ce-form-control>
        {this.busy && <ce-block-ui></ce-block-ui>}
      </div>
    );
  }
}

openWormhole(CeAddress, ['shippingAddress', 'loading', 'busy'], false);
