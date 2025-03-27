/**
 * External dependencies.
 */
import { Component, Element, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';
import { __, sprintf } from '@wordpress/i18n';
import { debounce } from 'lodash';

/**
 * Internal dependencies.
 */
import { Address, AddressSuggestion, GoogleMapPlace } from '../../../types';
import { createErrorNotice } from '@store/notices/mutations';
import { getCountryRegions } from 'src/functions/address-settings';

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
  @Prop({ mutable: true }) regions: Array<{ value: string; label: string }> = [];

  /** Address line 1 */
  @Prop() addressLine1: string = '';

  /** Address line 2 */
  @Prop() isManually: boolean = false;

  /** Address suggestions */
  @State() addressSuggestions: Array<AddressSuggestion> = [];

  /** Show address suggestions */
  @Prop({ mutable: true }) showSuggestions: boolean = false;

  /** Place select event */
  @Event() scChangeAddress: EventEmitter<Address>;

  /** Show suggestions change event */
  @Event() scShowSuggestionsChange: EventEmitter<boolean>;

  /** Event to show address fields manually */
  @Event() scShowAddressFields: EventEmitter<void>;

  /** Focused index for keyboard navigation */
  @State() focusedIndex: number = -1;

  // Use Lodash debounce for fetchAddressSuggestions
  debouncedFetchAddressSuggestions = debounce((input: string) => {
    this.fetchAddressSuggestions(input);
  }, 300);

  @Watch('addressLine1')
  handleAddressLine1Change(newValue: string) {
    if (!this.address?.country) return;
    if (!!newValue && this.showSuggestions) {
      this.debouncedFetchAddressSuggestions(newValue);
    }
  }

  // Modify handleAddressChange to use the debounced function.
  @Watch('address')
  handleAddressChange() {
    if (!this.address?.country) return;
    if (!!this.address.line_1 && this.showSuggestions) {
      this.debouncedFetchAddressSuggestions(this.address.line_1);
    }
  }

  @Watch('showSuggestions')
  handleShowSuggestionsChange(newValue: boolean) {
    this.scShowSuggestionsChange.emit(newValue);
    if (newValue && this.addressSuggestions.length > 0) {
      this.focusedIndex = 0;
      this.el.focus();
    }
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
        pageSize: 5,
      }),
    });

    const addressResponse = await response.json();

    // If some error occurred, hide the suggestions and show error notice.
    if (!!addressResponse?.error?.message) {
      createErrorNotice({
        message: sprintf(__('Google Map Error: %s', 'surecart'), addressResponse?.error?.message),
      });
      this.showSuggestions = false;
      this.addressSuggestions = [];
      return;
    }

    // If no places found, hide the suggestions.
    if (!addressResponse?.places?.length) {
      this.showSuggestions = false;
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
    const googleMapState = addressComponents.find(component => component.types.includes('administrative_area_level_1'))?.shortText || null;

    // If address country and google address components country is different, update the regions.
    const country = addressComponents.find(component => component.types.includes('country'))?.shortText || null;
    if (this.address?.country !== country) {
      this.regions = await getCountryRegions(country);
    }

    // Update the address with the place details.
    this.scChangeAddress.emit({
      ...(this.address as Address),
      line_1: place.displayName || null,
      line_2: addressComponents.find(component => component.types.includes('sublocality'))?.shortText || null,
      city: addressComponents.find(component => component.types.includes('locality'))?.shortText || null,
      postal_code: addressComponents.find(component => component.types.includes('postal_code'))?.shortText || null,
      state: this.regions?.find(region => region.value === googleMapState)?.value || null,
      country,
    });

    this.showSuggestions = false;
    this.scShowAddressFields.emit();
  }

  handleKeyDown(event: KeyboardEvent) {
    if (!this.addressSuggestions.length) return;

    const listElement = this.el.shadowRoot.querySelector('.sc-address__suggestions--list') as HTMLElement;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.focusedIndex = (this.focusedIndex + 1) % this.addressSuggestions.length;
        this.updateFocus(listElement);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.focusedIndex = (this.focusedIndex - 1 + this.addressSuggestions.length) % this.addressSuggestions.length;
        this.updateFocus(listElement);
        break;
      case 'Enter':
        event.preventDefault();
        if (this.focusedIndex >= 0) {
          this.fetchPlaceDetails(this.addressSuggestions[this.focusedIndex].placeId);
        }
        break;
      case 'Escape':
        this.showSuggestions = false;
        this.addressSuggestions = [];
        break;
    }
  }

  updateFocus(listElement: HTMLElement) {
    const focusedItem = listElement?.children[this.focusedIndex] as HTMLElement;
    focusedItem?.focus();
  }

  manualAddress() {
    this.showSuggestions = false;
    this.scShowAddressFields.emit();

    // If the address line 1 is not empty, we want to show the address fields.
    if (!!this.addressLine1) {
      this.scChangeAddress.emit({
        ...(this.address as Address),
        line_1: this.addressLine1,
      });
    }
  }

  handleOutsideClick(evt) {
    // If suggestions are false, return.
    if (!this.showSuggestions) {
      return;
    }

    const path = evt.composedPath();
    if (
      !path.some(item => {
        return item === this.el;
      })
    ) {
      this.showSuggestions = false;

      // If the address line 1 is not empty, we want to show the address fields.
      if (this.addressLine1) {
        this.scShowAddressFields.emit();
        this.scChangeAddress.emit({
          ...(this.address as Address),
          line_1: this.addressLine1,
        });
      }
    }
  }

  componentWillLoad() {
    document.addEventListener('mousedown', evt => this.handleOutsideClick(evt));
  }

  componentDidLoad() {
    this.el.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  disconnectedCallback() {
    this.el.removeEventListener('keydown', this.handleKeyDown.bind(this));
    this.debouncedFetchAddressSuggestions.cancel();
  }

  highlightMatch(text: string, query: string) {
    // Split query into words and filter out empty strings.
    const words = query.split(/\s+/).filter(word => word);

    // If no valid words, return the original text.
    if (words.length === 0) {
      return text;
    }

    try {
      // Create a regex to match any word in the query.
      const regex = new RegExp(`(${words.join('|')})`, 'gi');

      // Replace matched words with highlighted version.
      return text.replace(regex, '<strong>$1</strong>');
    } catch (error) {
      // If regex creation fails, return the original text.
      console.error('Invalid regex in highlightMatch:', error);
      return text;
    }
  }

  renderAddressSuggestions() {
    if (!this.showSuggestions || !this.addressLine1) {
      return null;
    }

    return (
      <div class="sc-address-suggestion" part="base">
        <div
          class={{
            'sc-address__suggestions': true,
            'sc-address__suggestions--visible': this.showSuggestions,
          }}
          part="suggestions"
        >
          <ul class="sc-address__suggestions--list" part="suggestions-list" role="list">
            <li
              class="sc-address__suggestions--item sc-address__suggestions--item--no-select sc-address__suggestions--item--powered-by"
              part="suggestion-item powered-by"
              role="listitem"
              tabindex="-1"
            >
              <span>
                {__('Suggestions powered by ', 'surecart')}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                  <span>{__('Google', 'surecart')}</span>
                </a>
              </span>
              <sc-button
                type="text"
                onClick={() => {
                  this.showSuggestions = false;
                  this.addressSuggestions = [];
                }}
                aria-label={__('Close suggestions', 'surecart')}
              >
                <sc-icon name="x" style={{ color: 'var(--sc-color-gray-500)' }}></sc-icon>
              </sc-button>
            </li>

            {this.addressSuggestions.length === 0 && (
              <li
                class="sc-address__suggestions--item sc-address__suggestions--item--no-select sc-address__suggestions--item--no-result"
                part="suggestion-item no-result"
                role="listitem"
                tabindex="-1"
              >
                {__('No results found', 'surecart')}
              </li>
            )}

            {this.addressSuggestions.map((suggestion, index) => (
              <li
                class={{
                  'sc-address__suggestions--item': true,
                  'focused': this.focusedIndex === index,
                }}
                part="suggestion-item"
                role="option"
                aria-selected={this.focusedIndex === index ? 'true' : 'false'}
                aria-label={sprintf(__('Select suggestion %s', 'surecart'), suggestion.displayName)}
                tabindex={this.focusedIndex === index ? '0' : '-1'}
                onClick={() => this.fetchPlaceDetails(suggestion?.placeId)}
                innerHTML={this.highlightMatch(suggestion.displayName, this.addressLine1)}
                onMouseEnter={() => (this.focusedIndex = index)}
                onMouseLeave={() => (this.focusedIndex = -1)}
              ></li>
            ))}

            {this.isManually && (
              <li
                class="sc-address__suggestions--item sc-address__suggestions--item--no-select sc-address__suggestions--item--manually"
                part="suggestion-item manually"
                role="listitem"
                tabindex="-1"
              >
                <button onClick={() => this.manualAddress()}>{__('Enter address manually', 'surecart')}</button>
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  }

  render() {
    return this.renderAddressSuggestions();
  }
}
