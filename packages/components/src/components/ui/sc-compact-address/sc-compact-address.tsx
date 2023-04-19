import { Component, Element, Event, EventEmitter, h, Method, Prop, State, Watch } from '@stencil/core';
import { Address } from '../../../types';
import { countryChoices, hasState } from '../../../functions/address';
import { __ } from '@wordpress/i18n';
import { reportChildrenValidity } from '../../../functions/form-data';

/**
 * @part base - The elements base wrapper.
 * @part input__base - The inputs base element.
 * @part select__base - The select boxes base element.
 * @part input - The html input element.
 * @part form-control - The form control wrapper.
 * @part label - The input label.
 * @part help-text - Help text that describes how to use the input.
 * @part trigger - The select box trigger.
 * @part panel - The select box panel.
 * @part caret - The select box caret.
 * @part search__base - The select search base.
 * @part search__input - The select search input.
 * @part search__form-control - The select search form control.
 * @part menu__base - The select menu base.
 * @part spinner__base  - The select spinner base.
 * @part empty - The select empty message.
 * @part block-ui - The block ui base component.
 * @part block-ui__content - The block ui content (spinner).
 */
@Component({
  tag: 'sc-compact-address',
  styleUrl: 'sc-compact-address.scss',
  shadow: true,
})
export class ScCompactAddress {
  @Element() el: HTMLScCompactAddressElement;

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

  /**Placeholders */
  @Prop() placeholders: Partial<Address> = {
    country: '',
    postal_code: '',
    state: '',
  };

  /** Label for the address */
  @Prop() label: string = __('Country or region', 'surecart');

  /** Is this required? */
  @Prop() required: boolean;

  /** Is this loading */
  @Prop() loading: boolean;

  /** Address change event. */
  @Event() scChangeAddress: EventEmitter<Partial<Address>>;

  /** Address input event. */
  @Event() scInputAddress: EventEmitter<Partial<Address>>;

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
    this.showState = ['US', 'CA'].includes(this.address.country);
    this.showPostal = ['US'].includes(this.address.country);
    this.scChangeAddress.emit(this.address);
    this.scInputAddress.emit(this.address);
  }

  updateAddress(address: Partial<Address>) {
    this.address = { ...this.address, ...address };
  }

  handleAddressInput(address: Partial<Address>) {
    this.scInputAddress.emit({ ...this.address, ...address });
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

  @Method()
  async reportValidity() {
    return reportChildrenValidity(this.el);
  }

  getStatePlaceholder() {
    if (this.placeholders?.state) return this.placeholders.state;

    if (this.address?.country === 'US') return __('State', 'surecart');

    return __('Province/Region', 'surecart');
  }

  render() {
    return (
      <div class="sc-address" part="base">
        <sc-form-control exportparts="label, help-text, form-control" label={this.label} class="sc-address__control" part="control" required={this.required}>
          <sc-select
            exportparts="base:select__base, input, form-control, label, help-text, trigger, panel, caret, search__base, search__input, search__form-control, menu__base, spinner__base, empty"
            value={this.address?.country}
            onScChange={(e: any) => {
              this.clearAddress();
              this.updateAddress({ country: e.target.value || null });
            }}
            choices={this.countryChoices}
            autocomplete={'country-name'}
            placeholder={this.placeholders?.country || __('Select Your Country', 'surecart')}
            name={this.names.country}
            search
            unselect={false}
            squared-bottom={this.showState || this.showPostal}
            required={this.required}
          />

          <div class="sc-address__columns">
            {this.showState && (
              <sc-select
                exportparts="base:select__base, input, form-control, label, help-text, trigger, panel, caret, search__base, search__input, search__form-control, menu__base, spinner__base, empty"
                placeholder={this.getStatePlaceholder()}
                name={this.names.state}
                autocomplete={'address-level1'}
                value={this?.address?.state}
                onScChange={(e: any) => this.updateAddress({ state: e.target.value || null })}
                choices={this.regions}
                required={this.required}
                search
                squared-top
                unselect={false}
                squared-right={this.showPostal}
              />
            )}
            {this.showPostal && (
              <sc-input
                exportparts="base:input__base, input, form-control, label, help-text"
                placeholder={this.placeholders?.postal_code || __('Postal Code/Zip', 'surecart')}
                name={this.names.postal_code}
                onScChange={(e: any) => this.updateAddress({ postal_code: e.target.value || null })}
                onScInput={(e: any) => this.handleAddressInput({ name: e.target.value || null })}
                autocomplete={'postal-code'}
                required={this.required}
                value={this?.address?.postal_code}
                squared-top
                maxlength={5}
                squared-left={this.showState}
              />
            )}
          </div>
        </sc-form-control>
        {this.loading && <sc-block-ui exportparts="base:block-ui, content:block-ui__content"></sc-block-ui>}
      </div>
    );
  }
}
