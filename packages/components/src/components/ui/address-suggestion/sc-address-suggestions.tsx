/**
 * External dependencies.
 */
import { Component, Element, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';
import { __, sprintf } from '@wordpress/i18n';
import { debounce } from 'lodash';

/**
 * Internal dependencies.
 */
import { Address, AddressSuggestion } from '../../../types';
import { createErrorNotice } from '@store/notices/mutations';
import { highlightMatch, updateFocus, fetchAddressSuggestions, fetchPlaceDetails } from './utils/suggestion-utils';

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

  @Prop() names: Partial<Address> = {
    name: 'shipping_name',
    country: 'shipping_country',
    city: 'shipping_city',
    line_1: 'shipping_line_1',
    line_2: 'shipping_line_2',
    postal_code: 'shipping_postal_code',
    state: 'shipping_state',
  };

  @Prop() label: string = __('Address', 'surecart');

  @Prop() inputProps: any = {};
  @Prop() disabled: boolean = false;
  @Prop() required: boolean = true;

  @State() value: string = '';

  /** Holds the regions for a given country. */
  @Prop({ mutable: true }) regions: Array<{ value: string; label: string }> = [];

  /** Is manually **/
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

  /** Event to hide address fields */
  @Event() scHideAddressFields: EventEmitter<void>;

  /** Event to update address */
  @Event() scChange: EventEmitter<void>;

  /** On input change */
  @Event() scInput: EventEmitter<void>;

  /** Focused index for keyboard navigation */
  @State() focusedIndex: number = -1;

  // Use Lodash debounce for fetchAddressSuggestions.
  debouncedFetchAddressSuggestions = debounce(async (input: string) => {
    try {
      this.addressSuggestions = await fetchAddressSuggestions(input, this.address?.country, this.regions);
    } catch (error) {
      createErrorNotice({
        message: sprintf(__('Google Map Error: %s', 'surecart'), error.message),
      });
      this.showSuggestions = false;
      this.addressSuggestions = [];
    }
  }, 100);

  @Watch('value')
  handleAddressLine1Change(newValue: string) {
    if (!this.address?.country) return;
    if (!!newValue && this.showSuggestions) {
      this.debouncedFetchAddressSuggestions(newValue);
    }
  }

  @Watch('address')
  handleAddressChange() {
    if (!this.address?.country) return;
    this.value = this.address.line_1;
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

  async fetchPlaceDetails(placeId: string) {
    try {
      const { updatedAddress, updatedRegions } = await fetchPlaceDetails(placeId, this.addressSuggestions, this.address, this.regions);
      this.address = updatedAddress;
      this.regions = updatedRegions;
      this.showSuggestions = false;
      this.scShowAddressFields.emit();
    } catch (error) {
      createErrorNotice({
        message: sprintf(__('Google Map Error: %s', 'surecart'), error.message),
      });
    }
  }

  handleInputChange(e: any) {
    this.value = e.target?.value;
    this.showSuggestions = true;

    this.scChange.emit();
  }

  handleKeyDown(event: KeyboardEvent) {
    if (!this.addressSuggestions.length) return;

    const listElement = this.el.shadowRoot.querySelector('.sc-address__suggestions--list') as HTMLElement;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.focusedIndex = (this.focusedIndex + 1) % this.addressSuggestions.length;
        updateFocus(listElement, this.focusedIndex);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.focusedIndex = (this.focusedIndex - 1 + this.addressSuggestions.length) % this.addressSuggestions.length;
        updateFocus(listElement, this.focusedIndex);
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

  manualAddress() {
    this.showSuggestions = false;
    this.scShowAddressFields.emit();

    // If the address line 1 is not empty, we want to show the address fields.
    if (!!this.value) {
      this.scChangeAddress.emit({
        ...(this.address as Address),
        line_1: this.value,
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
      if (this.value) {
        this.scShowAddressFields.emit();
        this.scChangeAddress.emit({
          ...(this.address as Address),
          line_1: this.value,
        });
      }
    }
  }

  componentWillLoad() {
    this.handleAddressChange();

    // On load, if google map api key is set, show the address fields.
    if (!!window?.scData?.google_map_api_key && !this.address?.line_1) {
      this.scHideAddressFields.emit();
    } else {
      this.scShowAddressFields.emit();
    }

    document.addEventListener('mousedown', evt => this.handleOutsideClick(evt));
  }

  componentDidLoad() {
    this.el.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  disconnectedCallback() {
    this.el.removeEventListener('keydown', this.handleKeyDown.bind(this));
    this.debouncedFetchAddressSuggestions.cancel();
  }

  renderAddressSuggestions() {
    if (!this.showSuggestions || !this.value) {
      return null;
    }

    return (
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
            aria-label={sprintf(__('Select suggestion %s', 'surecart'), suggestion.fullDisplayName)}
            tabindex={this.focusedIndex === index ? '0' : '-1'}
            onClick={() => this.fetchPlaceDetails(suggestion?.placeId)}
            innerHTML={highlightMatch(suggestion.fullDisplayName, this.value)}
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
    );
  }

  render() {
    return (
      <div part="base">
        <sc-input
          exportparts="base:input__base, input, form-control, label, help-text"
          value={this?.value}
          onScInput={(e: any) => this.handleInputChange(e)}
          autocomplete="street-address"
          placeholder={this.label}
          aria-label={this.label}
          name={this.names?.line_1}
          disabled={this.disabled}
          required={this.required}
          {...this.inputProps}
        />

        <div
          class={{
            'sc-address__suggestions': true,
            'sc-address__suggestions--visible': this.showSuggestions,
          }}
          part="suggestions"
        >
          {this.renderAddressSuggestions()}
        </div>
      </div>
    );
  }
}
