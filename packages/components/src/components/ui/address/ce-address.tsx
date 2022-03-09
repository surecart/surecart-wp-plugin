import { Component, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { hasState, hasCity, hasPostal, countryChoices } from '../../../functions/address';
import { Address } from '../../../types';

@Component({
  tag: 'ce-address',
  styleUrl: 'ce-address.scss',
  scoped: true,
})
export class CeAddress {
  /** The address. */
  @Prop({ mutable: true }) address: Partial<Address> = {
    country: '',
    city: '',
    line_1: '',
    line_2: '',
    postal_code: '',
    state: '',
  };

  @Prop() names: Partial<Address> = {
    country: 'shipping_country',
    city: 'shipping_country',
    line_1: 'shipping_line_1',
    line_2: 'shipping_line_2',
    postal_code: 'shipping_postal_code',
    state: 'shipping_state',
  };

  /** Is this loading?  */
  @Prop() loading: boolean = true;

  /** The label for the field. */
  @Prop() label: string;

  /** Is this required? */
  @Prop({ reflect: true }) required: boolean = true;

  /** Should we show the city field? */
  @State() showCity: boolean = true;

  /** Should we show the postal field? */
  @State() showPostal: boolean = true;

  /** Holds the regions for a given country. */
  @State() regions: Array<{ value: string; label: string }>;

  /** Holds our country choices. */
  @State() countryChoices: Array<{ value: string; label: string }> = countryChoices;

  /** Address change event. */
  @Event() ceChangeAddress: EventEmitter<Partial<Address>>;

  /** When the state changes, we want to update city and postal fields. */
  @Watch('address')
  handleAddressChange() {
    this.setRegions();
    this.showPostal = hasPostal(this.address.country);
    this.showCity = hasCity(this.address.country);
    this.ceChangeAddress.emit(this.address);
  }

  /** Set the regions based on the country. */
  setRegions() {
    if (hasState(this.address.country)) {
      import('./countries.json').then(module => {
        this.regions = module?.[this.address.country] as Array<{ value: string; label: string }>;
      });
    } else {
      this.regions = [];
    }
  }

  updateAddress(address: Partial<Address>) {
    this.address = { ...this.address, ...address };
  }

  clearAddress() {
    this.address = {
      country: '',
      city: '',
      line_1: '',
      line_2: '',
      postal_code: '',
      state: '',
    };
  }

  componentWillLoad() {
    this.handleAddressChange();
  }

  render() {
    return (
      <div class="ce-address">
        <ce-form-control label={this.label} class="ce-address__control" part="control" required={this.required}>
          <ce-select
            value={this?.address?.country}
            onCeChange={(e: any) => {
              this.clearAddress();
              this.updateAddress({ country: e.target.value });
            }}
            choices={this.countryChoices}
            autocomplete={'country-name'}
            placeholder={__('Country', 'checkout_engine')}
            name={this.names.country}
            search
            squared-bottom
            required={this.required}
          />

          <ce-input
            value={this?.address?.line_1}
            onCeChange={(e: any) => this.updateAddress({ line_1: e.target.value })}
            autocomplete="street-address"
            placeholder={__('Address', 'checkout_engine')}
            name={this.names.line_1}
            squared
            required={this.required}
          />

          <div class="ce-address__columns">
            <ce-input
              placeholder={__('City', 'checkout_engine')}
              name={this.names.city}
              value={this?.address?.city}
              onCeChange={(e: any) => this.updateAddress({ city: e.target.value })}
              required={this.required && this.showCity}
              hidden={!this.showCity}
              squared={!!this?.regions?.length}
              style={{ marginRight: this.showPostal ? '-1px' : '0' }}
              squared-top
              squared-right={this.showPostal}
            />
            <ce-input
              placeholder={__('Postal Code/Zip', 'checkout_engine')}
              name={this.names.postal_code}
              onCeChange={(e: any) => this.updateAddress({ postal_code: e.target.value })}
              autocomplete={'postal-code'}
              required={this.required && this.showPostal}
              hidden={!this.showPostal}
              value={this?.address?.postal_code}
              squared={!!this?.regions?.length}
              squared-top
              squared-left={this.showCity}
            />
          </div>

          <ce-select
            placeholder={__('State/Province/Region', 'checkout_engine')}
            name={this.names.state}
            autocomplete={'address-level1'}
            value={this?.address?.state}
            onCeChange={(e: any) => this.updateAddress({ state: e.target.value })}
            choices={this.regions}
            required={this.required && !!this?.regions?.length}
            hidden={!this?.regions?.length || !this.address?.country}
            search
            squared-top
          />
        </ce-form-control>
      </div>
    );
  }
}
