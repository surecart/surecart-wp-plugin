import { Component, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';
import { Address } from '../../../types';
import { countryChoices, hasState } from '../../../functions/address';
import { __ } from '@wordpress/i18n';

@Component({
  tag: 'sc-compact-address',
  styleUrl: 'sc-compact-address.scss',
  shadow: false,
})
export class ScCompactAddress {
  /** The address. */
  @Prop({ mutable: true }) address: Partial<Address> = {
    country: null,
    city: null,
    line_1: null,
    line_2: null,
    postal_code: null,
    state: null,
  };

  @Prop() names: Partial<Address> = {
    country: 'shipping_country',
    city: 'shipping_city',
    line_1: 'shipping_line_1',
    line_2: 'shipping_line_2',
    postal_code: 'shipping_postal_code',
    state: 'shipping_state',
  };

  /** Label for the address */
  @Prop() label: string = __('Country or region', 'surecart');

  /** Is this required? */
  @Prop() required: boolean;

  /** Is this loading */
  @Prop() loading: boolean;

  /** Address change event. */
  @Event() scChangeAddress: EventEmitter<Partial<Address>>;

  /** Holds our country choices. */
  @State() countryChoices: Array<{ value: string; label: string }> = countryChoices;

  /** Holds the regions for a given country. */
  @State() regions: Array<{ value: string; label: string }>;

  @State() showState: boolean;
  @State() showPostal: boolean;

  /** When the state changes, we want to update city and postal fields. */
  @Watch('address')
  handleAddressChange() {
    if (!this.address.country) return;
    this.setRegions();
    this.scChangeAddress.emit(this.address);
    this.showState = ['US', 'CA'].includes(this.address.country);
    this.showPostal = ['US'].includes(this.address.country);
  }

  updateAddress(address: Partial<Address>) {
    this.address = { ...this.address, ...address };
  }

  clearAddress() {
    this.address = {
      country: null,
      line_1: null,
      line_2: null,
      city: null,
      postal_code: null,
      state: null,
    };
  }

  /** Set the regions based on the country. */
  setRegions() {
    if (hasState(this.address.country)) {
      import('../address/countries.json').then(module => {
        this.regions = module?.[this.address.country] as Array<{ value: string; label: string }>;
      });
    } else {
      this.regions = [];
    }
  }

  componentWillLoad() {
    this.handleAddressChange();
    const country = this.countryChoices.find(country => country.value === this.address.country)?.value;
    if (country) {
      this.updateAddress({ country });
    }
  }

  render() {
    return (
      <div class="sc-address">
        <sc-form-control label={this.label} class="sc-address__control" part="control" required={this.required}>
          <sc-select
            value={this.address?.country}
            onScChange={(e: any) => {
              this.clearAddress();
              this.updateAddress({ country: e.target.value || null });
            }}
            choices={this.countryChoices}
            autocomplete={'country-name'}
            placeholder={__('Select Your Country', 'surecart')}
            name={this.names.country}
            search
            unselect={false}
            squared-bottom={this.showState || this.showPostal}
            required={this.required}
          />

          <div class="sc-address__columns">
            <sc-select
              placeholder={this.address.country === 'US' ? __('State', 'surecart') : __('Province/Region', 'surecart')}
              name={this.names.state}
              autocomplete={'address-level1'}
              value={this?.address?.state}
              onScChange={(e: any) => this.updateAddress({ state: e.target.value || null })}
              choices={this.regions}
              required={this.required && !!this.showState}
              hidden={!this.showState}
              search
              squared-top
              unselect={false}
              squared-right={this.showPostal}
            />
            <sc-input
              placeholder={__('Postal Code/Zip', 'surecart')}
              name={this.names.postal_code}
              onScChange={(e: any) => this.updateAddress({ postal_code: e.target.value || null })}
              autocomplete={'postal-code'}
              required={this.required && !!this.showPostal}
              hidden={!this.showPostal}
              value={this?.address?.postal_code}
              squared={!!this?.regions?.length}
              squared-top
              maxlength={5}
              squared-left={this.showState}
            />
          </div>
        </sc-form-control>
        {this.loading && <sc-block-ui></sc-block-ui>}
      </div>
    );
  }
}
