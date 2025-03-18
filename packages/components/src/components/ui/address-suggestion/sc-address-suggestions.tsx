/**
 * External dependencies.
 */
import { Component, Element, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { Address, AddressSuggestion, GoogleMapPlace } from '../../../types';
import { createErrorNotice } from '@store/notices/mutations';

@Component({
  tag: 'sc-address-suggestions',
  styleUrl: 'sc-address-suggestions.scss',
  shadow: true,
})
export class ScAddressSuggestions {
  @Element() el: HTMLScAddressElement;

  @Prop({ mutable: true }) address: Partial<Address> = {
    country: null,
    city: null,
    line_1: null,
    line_2: null,
    postal_code: null,
    state: null,
  };

  /** Holds the regions for a given country. */
  @Prop() regions: Array<{ value: string; label: string }>;

  /** Address suggestions */
  @State() addressSuggestions: Array<AddressSuggestion> = [];

  /** Show address suggestions */
  @Prop({ mutable: true }) showSuggestions: boolean = false;

  /** Place select event */
  @Event() scPlaceSelect: EventEmitter<Address>;

  /** Show suggestions change event */
  @Event() scShowSuggestionsChange: EventEmitter<boolean>;

  /** Event to show address fields manually */
  @Event() scShowAddressFields: EventEmitter<void>;

  @Watch('address')
  handleAddressChange() {
    if (!this.address?.country) return;

    // if address line 1 changes, we want to fetch address suggestions.
    if (!!this.address.line_1 && this.showSuggestions) {
      this.fetchAddressSuggestions(this.address.line_1);
    }
  }

  @Watch('showSuggestions')
  handleShowSuggestionsChange(newValue: boolean) {
    this.scShowSuggestionsChange.emit(newValue);
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
      this.addressSuggestions = [];
      return;
    }

    // If no places found, hide the suggestions.
    if (!addressResponse?.places?.length) {
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

  async fetchPlaceDetails(placeId: string) {
    // Find the places from the suggestions.
    const place = this.addressSuggestions.find((suggestion: AddressSuggestion) => suggestion.placeId === placeId);
    if (!place?.addressComponents) {
      return;
    }

    const { addressComponents } = place;

    // Only update the state if it is in the regions list.
    const mapState = addressComponents.find(component => component.types.includes('administrative_area_level_1'))?.shortText || null;
    const state = this.regions?.find(region => region.value === mapState)?.value || null;

    // Update the address with the place details.
    this.scPlaceSelect.emit({
      line_1: place.displayName || null,
      city: addressComponents.find(component => component.types.includes('locality'))?.shortText || null,
      state,
      postal_code: addressComponents.find(component => component.types.includes('postal_code'))?.shortText || null,
      country: addressComponents.find(component => component.types.includes('country'))?.shortText || null,
    });

    this.addressSuggestions = [];
    this.showSuggestions = false;
    this.scShowAddressFields.emit();
  }

  renderAddressSuggestions() {
    // if no addressSuggestions, return.
    if (!this.showSuggestions || !this.addressSuggestions?.length || !this.address.line_1) {
      return null;
    }

    return (
      <div class="sc-address-suggestion" part="base">
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
                    this.showSuggestions = false;
                    this.addressSuggestions = [];
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
                onClick={() => this.scShowAddressFields.emit()}
              >
                {__('Enter address manually', 'surecart')}
              </sc-menu-item>
            </sc-menu>
          </sc-dropdown>
        </div>
      </div>
    );
  }

  render() {
    return this.renderAddressSuggestions();
  }
}
