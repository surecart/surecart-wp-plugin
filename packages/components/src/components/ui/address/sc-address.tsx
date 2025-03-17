import { Component, Element, Event, EventEmitter, h, Method, Prop, State, Watch } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { hasCity, hasPostal, countryChoices } from '../../../functions/address';
import { reportChildrenValidity } from '../../../functions/form-data';
import { Address, CountryLocaleField, CountryLocaleFieldValue } from '../../../types';
import { sortAddressFields } from 'src/functions/address-settings';
import { state as i18nState } from '@store/i18n';

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
  tag: 'sc-address',
  styleUrl: 'sc-address.scss',
  shadow: true,
})
export class ScAddress {
  @Element() el: HTMLScAddressElement;

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
    name: 'shipping_name',
    country: 'shipping_country',
    city: 'shipping_city',
    line_1: 'shipping_line_1',
    line_2: 'shipping_line_2',
    postal_code: 'shipping_postal_code',
    state: 'shipping_state',
  };

  /** Is this loading?  */
  @Prop() loading: boolean = false;

  /** Is this disabled? */
  @Prop() disabled: boolean;

  /** The label for the field. */
  @Prop() label: string;

  /** Should we show name field? */
  @Prop({ reflect: true, mutable: true }) showName: boolean;

  /** Should we show name field? */
  @Prop() showLine2: boolean;

  /** Is this required? */
  @Prop({ reflect: true }) required: boolean = false;

  /** Is the name required */
  @Prop({ reflect: true }) requireName: boolean = false;

  /** Default country fields */
  @Prop({ mutable: true }) defaultCountryFields: Array<CountryLocaleFieldValue>;

  /** Country fields by country code */
  @Prop({ mutable: true }) countryFields: Array<CountryLocaleField>;

  /** Should we show the city field? */
  @State() showCity: boolean = true;

  /** Should we show the postal field? */
  @State() showPostal: boolean = true;

  /** Holds the regions for a given country. */
  @State() regions: Array<{ value: string; label: string }>;

  /** Holds our country choices. */
  @State() countryChoices: Array<{ value: string; label: string }> = countryChoices;

  /** Address change event. */
  @Event() scChangeAddress: EventEmitter<Partial<Address>>;

  /** Address change event. */
  @Event() scInputAddress: EventEmitter<Partial<Address>>;

  /** When the state changes, we want to update city and postal fields. */
  @Watch('address')
  handleAddressChange() {
    if (!this.address?.country) return;
    this.setRegions();
    this.showPostal = hasPostal(this.address.country);
    this.showCity = hasCity(this.address.country);
    this.scChangeAddress.emit(this.address);
    this.scInputAddress.emit(this.address);
  }

  @Watch('requireName')
  handleNameChange() {
    if (this.requireName) {
      this.showName = true;
    }
  }

  decodeHtmlEntities(html: string) {
    return new DOMParser().parseFromString(html, 'text/html')?.body.textContent || html;
  }

  updateAddress(address: Partial<Address>) {
    this.address = { ...this.address, ...address };
  }

  handleAddressInput(address: Partial<Address>) {
    this.scInputAddress.emit({ ...this.address, ...address });
  }

  clearAddress() {
    this.address = {
      name: this.address?.name,
      country: null,
      city: null,
      line_1: null,
      line_2: null,
      postal_code: null,
      state: null,
    };
  }

  /** Set the regions based on the country. */
  setRegions() {
    import('country-region-data').then(module => {
      this.regions = (module?.[this.address.country]?.[2] || []).map(region => ({
        value: region[1],
        label: this.decodeHtmlEntities(region[0]),
      }));
    });
  }

  componentWillLoad() {
    this.handleAddressChange();
    const country = this.countryChoices.find(country => country.value === this.address?.country)?.value || null;

    // Set default country fields.
    this.defaultCountryFields = this.defaultCountryFields || i18nState.defaultCountryFields || [];
    this.countryFields = this.countryFields || i18nState.countryFields || [];

    this.updateAddress({ country });
    this.handleNameChange();
  }

  @Method()
  async reportValidity() {
    return reportChildrenValidity(this.el);
  }

  /**
   * Compute and return the sorted fields based on current country, defaultCountryFields and countryFields.
   * This method can be used as a computed property.
   */
  sortedFields(): Array<CountryLocaleFieldValue> {
    const countrySpecificFields = this.countryFields?.[this.address?.country] || {};
    const mergedCountryFields = (this.defaultCountryFields || []).map(field => {
      if (countrySpecificFields[field.name]) {
        return {
          ...field,
          ...countrySpecificFields[field.name],
        };
      }
      return field;
    });

    return sortAddressFields(this.address?.country, mergedCountryFields, this.countryFields);
  }

  getRoundedProps(index: number, length: number) {
    const isFirst = index === 0;
    const isLast = index === length - 1;

    return {
      squaredTop: isLast,
      squaredBottom: isFirst,
      squared: !isLast && !isFirst,
    };
  }

  render() {
    const visibleFields = (this.sortedFields() ?? []).filter(field => {
      switch (field.name) {
        case 'name':
          return this.showName;
        case 'address_2':
          return this.showLine2 || !!this?.address?.line_2?.length;
        case 'city':
          return this.showCity;
        case 'state':
          return !!this?.regions?.length && !!this?.address?.country;
        case 'postcode':
          return this.showPostal;
        default:
          return true;
      }
    });

    return (
      <div class="sc-address" part="base">
        <sc-form-control label={this.label} exportparts="label, help-text, form-control" class="sc-address__control" required={this.required}>
          {visibleFields.map((field: any, index: number) => {
            const roundedProps = this.getRoundedProps(index, visibleFields.length);

            switch (field.name) {
              case 'country':
                return (
                  <sc-select
                    exportparts="base:select__base, input, form-control, label, help-text, trigger, panel, caret, search__base, search__input, search__form-control, menu__base, spinner__base, empty"
                    part="name__input"
                    value={this.address?.country}
                    onScChange={(e: any) => {
                      this.clearAddress();
                      this.updateAddress({ country: e.target.value });
                    }}
                    choices={this.countryChoices}
                    autocomplete={'country-name'}
                    placeholder={field.label}
                    name={this.names?.country}
                    search
                    unselect={false}
                    disabled={this.disabled}
                    required={this.required}
                    aria-label={field.label}
                    {...roundedProps}
                  />
                );

              case 'name':
                return (
                  <sc-input
                    exportparts="base:input__base, input, form-control, label, help-text"
                    value={this?.address?.name}
                    onScChange={(e: any) => this.updateAddress({ name: e.target.value || null })}
                    onScInput={(e: any) => this.handleAddressInput({ name: e.target.value || null })}
                    autocomplete="street-address"
                    placeholder={field.label}
                    name={this.names?.name}
                    disabled={this.disabled}
                    required={this.requireName}
                    aria-label={field.label}
                    {...roundedProps}
                  />
                );

              case 'address_1':
                return (
                  <sc-input
                    exportparts="base:input__base, input, form-control, label, help-text"
                    value={this?.address?.line_1}
                    onScChange={(e: any) => this.updateAddress({ line_1: e.target.value || null })}
                    onScInput={(e: any) => this.handleAddressInput({ line_1: e.target.value || null })}
                    autocomplete="street-address"
                    placeholder={field.label}
                    name={this.names?.line_1}
                    disabled={this.disabled}
                    required={this.required}
                    aria-label={field.label}
                    {...roundedProps}
                  />
                );

              case 'address_2':
                return (
                  <sc-input
                    exportparts="base:input__base, input, form-control, label, help-text"
                    value={this?.address?.line_2}
                    onScChange={(e: any) => this.updateAddress({ line_2: e.target.value || null })}
                    onScInput={(e: any) => this.handleAddressInput({ line_2: e.target.value || null })}
                    autocomplete="street-address"
                    placeholder={field.label}
                    name={this.names?.line_2}
                    disabled={this.disabled}
                    aria-label={field.label}
                    {...roundedProps}
                  />
                );

              case 'city':
                return (
                  <sc-input
                    exportparts="base:input__base, input, form-control, label, help-text"
                    placeholder={field.label}
                    name={this.names?.city}
                    value={this?.address?.city}
                    onScChange={(e: any) => this.updateAddress({ city: e.target.value || null })}
                    onScInput={(e: any) => this.handleAddressInput({ city: e.target.value || null })}
                    required={this.required}
                    disabled={this.disabled}
                    aria-label={field.label}
                    {...roundedProps}
                  />
                );

              case 'state':
                return (
                  <sc-select
                    exportparts="base:select__base, input, form-control, label, help-text, trigger, panel, caret, search__base, search__input, search__form-control, menu__base, spinner__base, empty"
                    placeholder={field.label}
                    name={this.names?.state}
                    autocomplete={'address-level1'}
                    value={this?.address?.state}
                    onScChange={(e: any) => this.updateAddress({ state: e.target.value || e.detail?.value || null })}
                    choices={this.regions}
                    required={this.required}
                    disabled={this.disabled}
                    search
                    aria-label={field.label}
                    {...roundedProps}
                  />
                );

              case 'postcode':
                return (
                  <sc-input
                    exportparts="base:input__base, input, form-control, label, help-text"
                    placeholder={field.label}
                    name={this.names?.postal_code}
                    onScChange={(e: any) => this.updateAddress({ postal_code: e.target.value || null })}
                    onScInput={(e: any) => this.handleAddressInput({ postal_code: e.target.value || null })}
                    autocomplete={'postal-code'}
                    required={this.required}
                    value={this?.address?.postal_code}
                    disabled={this.disabled}
                    maxlength={this.address?.country === 'US' ? 5 : null}
                    aria-label={field.label}
                    {...roundedProps}
                  />
                );

              default:
                return null;
            }
          })}
        </sc-form-control>

        {this.loading && <sc-block-ui exportparts="base:block-ui, content:block-ui__content"></sc-block-ui>}
      </div>
    );
  }
}
