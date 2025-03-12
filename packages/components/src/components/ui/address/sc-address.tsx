import { Component, Element, Event, EventEmitter, h, Method, Prop, State, Watch } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { countryChoices } from '../../../functions/address';
import { reportChildrenValidity } from '../../../functions/form-data';
import { Address, AddressSuggestion, CountryLocaleField, CountryLocaleFieldValue, GoogleMapPlace } from '../../../types';
import { sortAddressFields } from 'src/functions/address-settings';
import { state as i18nState } from '@store/i18n';
import { createErrorNotice } from '@store/notices/mutations';

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

  /** Is this required? */
  @Prop({ reflect: true }) required: boolean = false;

  /** Is the name required */
  @Prop({ reflect: true }) requireName: boolean = false;

  /** Default country fields */
  @Prop({ mutable: true }) defaultCountryFields: Array<CountryLocaleFieldValue>;

  /** Country fields by country code */
  @Prop({ mutable: true }) countryFields: Array<CountryLocaleField>;

  /** Should we show name field? */
  @Prop() showLine2: boolean;

  /** Should we show the city field? */
  @State() showCity: boolean = false;

  /** Should we show the state field? */
  @State() showState: boolean = false;

  /** Should we show the postal field? */
  @State() showPostal: boolean = false;

  /** Holds the regions for a given country. */
  @State() regions: Array<{ value: string; label: string }>;

  /** Holds our country choices. */
  @State() countryChoices: Array<{ value: string; label: string }> = countryChoices;

  /** Address suggestions */
  @State() addressSuggestions: Array<AddressSuggestion> = [];

  /** Show address suggestions */
  @State() showAddressSuggestions: boolean = false;

  /** Address change event. */
  @Event() scChangeAddress: EventEmitter<Partial<Address>>;

  /** Address input event. */
  @Event() scInputAddress: EventEmitter<Partial<Address>>;

  /** When the state changes, we want to update city and postal fields. */
  @Watch('address')
  handleAddressChange() {
    if (!this.address?.country) return;
    this.setRegions();
    this.showCity = !!this.address?.city || !!this.address?.line_1;
    this.showState = !!this.address?.state || !!this.address?.line_1;
    this.showPostal = !!this.address?.postal_code || !!this.address?.line_1;
    this.scChangeAddress.emit(this.address);
    this.scInputAddress.emit(this.address);

    // if address line 1 changes, we want to fetch address suggestions
    if (!!this.address.line_1 && this.showAddressSuggestions) {
      this.fetchAddressSuggestions(this.address.line_1);
    }

    // If no api key set, then show the fields.
    if (!window?.scData?.google_map_api_key) {
      this.showAddressFields();
    }
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
    this.fetchUserCountry();
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

  async fetchUserCountry() {
    // If already set user country or Google Map API key is not set, return.
    if (this.address?.country || !window?.scData?.google_map_api_key) {
      return;
    }

    // Search for the user's country.
    const geoLocateResponse = await fetch('https://www.googleapis.com/geolocation/v1/geolocate?key=' + window?.scData?.google_map_api_key, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        considerIp: true,
      }),
    });

    const userCountryResponse = await geoLocateResponse.json();
    if (!userCountryResponse?.location) {
      return;
    }

    // Fetch the country name from the coordinates.
    const { lat, lng } = userCountryResponse.location;

    const countryResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${window?.scData?.google_map_api_key}`);
    const countryData = await countryResponse.json();

    // If some error occurred, return.
    if (countryData?.error_message) {
      return;
    }

    // Find the country from the address components.
    const country = countryData?.results?.[0]?.address_components?.find(component => component.types.includes('country'))?.short_name || null;
    if (!country) {
      return;
    }

    // Update the address with the user's country.
    this.updateAddress({ country });
  }

  async onChangeAddressLine1(e: any) {
    // If the google map api key is not set, update the address and return.
    if (!window?.scData?.google_map_api_key || !e.target.value) {
      this.updateAddress({ line_1: e.target.value || null });
      this.showAddressFields();
      return;
    }

    this.showAddressSuggestions = true;
    await this.fetchAddressSuggestions(e.target.value);
    this.showAddressFields();
  }

  async fetchAddressSuggestions(input: string) {
    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': window?.scData?.google_map_api_key,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.types,places.primaryType,places.primaryTypeDisplayName,places.addressComponents',
      },
      body: JSON.stringify({
        textQuery: input,
      }),
    });

    const addressResponse = await response.json();

    // If some error occurred, hide the suggestions and show error notice.
    if (!!addressResponse?.error?.message) {
      createErrorNotice({
        message: __('Google Map Error: ', 'surecart') + addressResponse?.error?.message,
      });

      this.showAddressSuggestions = false;
      this.addressSuggestions = [];
      return;
    }

    // If no places found, hide the suggestions.
    if (!addressResponse?.places?.length) {
      this.showAddressSuggestions = false;
      this.addressSuggestions = [];
      return;
    }

    // Map the address suggestions to a more readable format.
    this.addressSuggestions = addressResponse?.places?.map((place: GoogleMapPlace) => ({
      displayName: place.displayName?.text ?? input,
      placeId: place.id,
      addressComponents: place.addressComponents,
    }));
  }

  showAddressFields() {
    this.showCity = true;
    this.showState = true;
    this.showPostal = true;
  }

  async fetchPlaceDetails(placeId: string) {
    // Find the places from the suggestions.
    const place = this.addressSuggestions.find((suggestion: AddressSuggestion) => suggestion.placeId === placeId);
    if (!place?.addressComponents) {
      return;
    }

    const { addressComponents } = place;

    // Get the state value and check its length because for some countries, wrong values are returned.
    // And it then select the placeholder value.
    const stateValue = addressComponents.find(component => component.types.includes('administrative_area_level_1'))?.shortText || null;
    const state = stateValue && stateValue.length <= 3 ? stateValue : null;

    // Update the address with the place details.
    this.showAddressSuggestions = false;
    this.updateAddress({
      line_1: place.displayName || null,
      city: addressComponents.find(component => component.types.includes('locality'))?.shortText || null,
      state,
      postal_code: addressComponents.find(component => component.types.includes('postal_code'))?.shortText || null,
      country: addressComponents.find(component => component.types.includes('country'))?.shortText || null,
    });

    this.addressSuggestions = [];
  }

  renderAddressSuggestions() {
    if (!this.showAddressSuggestions || !this.addressSuggestions?.length) {
      return null;
    }

    return (
      <div class="sc-address__suggestions" part="suggestions">
        <sc-dropdown
          style={{ '--panel-width': '28.1em', '--sc-menu-item-white-space': 'wrap', '--sc-dropdown-overflow': 'hidden', '--sc-dropdown-overflow-y': 'auto' }}
          position="bottom-right"
          placement="bottom"
          open={this.addressSuggestions.length > 0}
        >
          <sc-menu>
            <sc-menu-item noSelect>
              <span slot="prefix">{__('Suggestions powered by Google', 'surecart')}</span>
              <sc-button
                slot="suffix"
                type="text"
                onClick={() => {
                  this.showAddressSuggestions = false;
                }}
              >
                <sc-icon name="x" style={{ color: 'var(--sc-color-gray-500)' }}></sc-icon>
              </sc-button>
            </sc-menu-item>

            {/* Address suggestions. */}
            {this.addressSuggestions.map(suggestion => (
              <sc-menu-item onClick={() => this.fetchPlaceDetails(suggestion?.placeId)}>{suggestion.displayName}</sc-menu-item>
            ))}

            {/* Enter address manually. */}
            <sc-menu-item
              noSelect
              style={{ '--sc-font-size-medium': 'var(--sc-font-size-small)', '--sc-menu-item-text-decoration': 'underline' }}
              onClick={() => this.showAddressFields()}
            >
              {__('Enter address manually', 'surecart')}
            </sc-menu-item>
          </sc-menu>
        </sc-dropdown>
      </div>
    );
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
          return this.showState && !!this?.regions?.length && !!this?.address?.country;
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
                  <div class="sc-address__line-1">
                    <sc-input
                      exportparts="base:input__base, input, form-control, label, help-text"
                      value={this?.address?.line_1}
                      onScChange={(e: any) => this.onChangeAddressLine1(e)}
                      onScInput={(e: any) => this.onChangeAddressLine1(e)}
                      autocomplete="street-address"
                      placeholder={field.label}
                      name={this.names?.line_1}
                      disabled={this.disabled}
                      required={this.required}
                      aria-label={field.label}
                      {...roundedProps}
                    />
                    {this.renderAddressSuggestions()}
                  </div>
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
