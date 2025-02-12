import { Component, Element, Event, EventEmitter, h, Method, Prop, State, Watch } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { hasCity, hasPostal, countryChoices } from '../../../functions/address';
import { reportChildrenValidity } from '../../../functions/form-data';
import { Address } from '../../../types';
import { countryLocale, sortAddressFields } from '../../../functions/address-settings';

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

  @Prop() placeholders: Partial<Address> = {};

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

  /** Should we show the city field? */
  @State() showCity: boolean = true;

  /** Should we show the postal field? */
  @State() showPostal: boolean = true;

  /** Holds the regions for a given country. */
  @State() regions: Array<{ value: string; label: string }>;

  /** Holds our country choices. */
  @State() countryChoices: Array<{ value: string; label: string }> = countryChoices;

  /** Holds the locale settings for the current country. */
  @State() localeSettings: any = {};

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
    this.localeSettings = countryLocale[this.address.country] || {};
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
    this.updateAddress({ country });
    this.handleNameChange();
  }

  @Method()
  async reportValidity() {
    return reportChildrenValidity(this.el);
  }

  render() {
    const fields = [
      { name: 'name', priority: 10 },
      { name: 'company', priority: 20 },
      { name: 'address_1', priority: 30 },
      { name: 'address_2', priority: 40 },
      { name: 'city', priority: 50 },
      { name: 'state', priority: 60 },
      { name: 'postcode', priority: 70 },
    ];

    const sortedFields = sortAddressFields(fields, this.localeSettings);

    // Filter out fields that should not be rendered.
    const visibleFields = sortedFields.filter(field => {
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
            placeholder={this.placeholders.country || __('Country', 'surecart')}
            name={this.names?.country}
            search
            unselect={false}
            squared-bottom
            disabled={this.disabled}
            required={this.required}
            aria-label={this.placeholders.country || __('Country', 'surecart')}
          />

          {visibleFields.map((field: any, index: number) => {
            let isLast = index === visibleFields.length - 1;

            switch (field.name) {
              case 'name':
                return (
                  this.showName && (
                    <sc-input
                      exportparts="base:input__base, input, form-control, label, help-text"
                      value={this?.address?.name}
                      onScChange={(e: any) => this.updateAddress({ name: e.target.value || null })}
                      onScInput={(e: any) => this.handleAddressInput({ name: e.target.value || null })}
                      autocomplete="street-address"
                      placeholder={this.placeholders.name || __('Name or Company Name', 'surecart')}
                      name={this.names?.name}
                      squared-top={isLast}
                      squared={!isLast}
                      disabled={this.disabled}
                      required={this.requireName}
                      aria-label={this.placeholders.name || __('Name or Company Name', 'surecart')}
                    />
                  )
                );

              case 'address_1':
                return (
                  <sc-input
                    exportparts="base:input__base, input, form-control, label, help-text"
                    value={this?.address?.line_1}
                    onScChange={(e: any) => this.updateAddress({ line_1: e.target.value || null })}
                    onScInput={(e: any) => this.handleAddressInput({ line_1: e.target.value || null })}
                    autocomplete="street-address"
                    placeholder={this.placeholders.line_1 || __('Address', 'surecart')}
                    name={this.names?.line_1}
                    squared-top={isLast}
                    squared={!isLast}
                    disabled={this.disabled}
                    required={this.required}
                    aria-label={this.placeholders.line_1 || __('Address', 'surecart')}
                  />
                );

              case 'address_2':
                return (
                  (this.showLine2 || !!this?.address?.line_2?.length) && (
                    <sc-input
                      exportparts="base:input__base, input, form-control, label, help-text"
                      value={this?.address?.line_2}
                      onScChange={(e: any) => this.updateAddress({ line_2: e.target.value || null })}
                      onScInput={(e: any) => this.handleAddressInput({ line_2: e.target.value || null })}
                      autocomplete="street-address"
                      placeholder={this.placeholders.line_2 || __('Address Line 2', 'surecart')}
                      name={this.names?.line_2}
                      squared-top={isLast}
                      squared={!isLast}
                      disabled={this.disabled}
                      aria-label={this.placeholders.line_2 || __('Address Line 2', 'surecart')}
                    />
                  )
                );

              case 'city':
                return (
                  this.showCity && (
                    <sc-input
                      exportparts="base:input__base, input, form-control, label, help-text"
                      placeholder={this.placeholders.city || __('City', 'surecart')}
                      name={this.names?.city}
                      value={this?.address?.city}
                      onScChange={(e: any) => this.updateAddress({ city: e.target.value || null })}
                      onScInput={(e: any) => this.handleAddressInput({ city: e.target.value || null })}
                      required={this.required}
                      squared-top={isLast}
                      squared={!isLast}
                      disabled={this.disabled}
                      aria-label={this.placeholders.city || __('City', 'surecart')}
                    />
                  )
                );

              case 'state':
                return (
                  !!this?.regions?.length &&
                  !!this?.address?.country && (
                    <sc-select
                      exportparts="base:select__base, input, form-control, label, help-text, trigger, panel, caret, search__base, search__input, search__form-control, menu__base, spinner__base, empty"
                      placeholder={this.placeholders.state || __('State/Province/Region', 'surecart')}
                      name={this.names?.state}
                      autocomplete={'address-level1'}
                      value={this?.address?.state}
                      onScChange={(e: any) => this.updateAddress({ state: e.target.value || e.detail?.value || null })}
                      choices={this.regions}
                      required={this.required}
                      disabled={this.disabled}
                      search
                      squared-top={isLast}
                      squared={!isLast}
                      aria-label={this.placeholders.state || __('State/Province/Region', 'surecart')}
                    />
                  )
                );

              case 'postcode':
                return (
                  this.showPostal && (
                    <sc-input
                      exportparts="base:input__base, input, form-control, label, help-text"
                      placeholder={this.placeholders.postal_code || __('Postal Code/Zip', 'surecart')}
                      name={this.names?.postal_code}
                      onScChange={(e: any) => this.updateAddress({ postal_code: e.target.value || null })}
                      onScInput={(e: any) => this.handleAddressInput({ postal_code: e.target.value || null })}
                      autocomplete={'postal-code'}
                      required={this.required}
                      value={this?.address?.postal_code}
                      squared-top={isLast}
                      squared={!isLast}
                      disabled={this.disabled}
                      maxlength={this.address?.country === 'US' ? 5 : null}
                      aria-label={this.placeholders.postal_code || __('Postal Code/Zip', 'surecart')}
                    />
                  )
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
