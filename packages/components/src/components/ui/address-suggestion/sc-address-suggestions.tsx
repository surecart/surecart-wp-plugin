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
import { highlightMatch, fetchAddressSuggestions, fetchPlaceDetails } from './utils/suggestion-utils';

@Component({
  tag: 'sc-address-suggestions',
  styleUrl: 'sc-address-suggestions.scss',
  shadow: true,
})
export class ScAddressSuggestions {
  @Element() el: HTMLScAddressSuggestionsElement;

  private boundHandleKeyDown: (e: KeyboardEvent) => void;
  private boundHandleOutsideClick: (e: Event) => void;
  private abortController: AbortController;
  private isSyncingFromAddress: boolean = false;
  /** Tracks whether the local value was set by user input / browser autofill and hasn't been synced to the address prop yet. */
  private hasUnsyncedLocalValue: boolean = false;

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

  /** The label for the address input */
  @Prop() label: string = __('Address', 'surecart');

  /** Props for the input element */
  @Prop() inputProps: Record<string, unknown> = {};

  /** If the address input is disabled */
  @Prop() disabled: boolean = false;

  /** If the address is required */
  @Prop() required: boolean = true;

  /** Holds the address line 1 value */
  @State() value: string = this.address?.line_1 || '';

  /** Holds the regions for a given country. */
  @Prop({ mutable: true }) regions: Array<{ value: string; label: string }> = [];

  /** Address suggestions */
  @State() addressSuggestions: Array<AddressSuggestion> = [];

  /** Show address suggestions */
  @Prop({ mutable: true }) showSuggestions: boolean = false;

  /** Loading state for suggestions */
  @State() loading: boolean = false;

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
    this.abortController?.abort();
    this.abortController = new AbortController();

    try {
      this.loading = true;
      this.addressSuggestions = await fetchAddressSuggestions(input, this.address?.country, this.regions, this.abortController.signal);
    } catch (error) {
      if (error?.name === 'AbortError') return;
      createErrorNotice({
        message: sprintf(__('Google Map Error: %s', 'surecart'), error.message),
      });
      this.showSuggestions = false;
      this.addressSuggestions = [];
    } finally {
      this.loading = false;
    }
  }, 300);

  @Watch('value')
  handleAddressLine1Change(newValue: string) {
    if (this.isSyncingFromAddress) return;
    if (!this.address?.country) return;
    if (newValue && this.showSuggestions) {
      this.debouncedFetchAddressSuggestions(newValue);
    }
  }

  @Watch('address')
  handleAddressChange() {
    if (!this.address?.country) return;
    this.isSyncingFromAddress = true;
    // Only preserve the local value if it was set by user input / browser
    // autofill and hasn't been synced to the address prop yet.
    // Otherwise always sync from the address prop (e.g. country change clears fields).
    if (this.hasUnsyncedLocalValue && !this.address.line_1) {
      // Keep current local value — browser autofill hasn't synced yet.
    } else {
      this.value = this.address.line_1 || '';
      this.hasUnsyncedLocalValue = false;
    }
    this.isSyncingFromAddress = false;
    this.toggleAddressInputs();

    if (this.address.line_1 && this.showSuggestions) {
      this.debouncedFetchAddressSuggestions(this.address.line_1);
    }
  }

  @Watch('showSuggestions')
  handleShowSuggestionsChange(newValue: boolean) {
    this.scShowSuggestionsChange.emit(newValue);
    if (newValue && this.addressSuggestions.length > 0) {
      this.focusedIndex = 0;
    }
  }

  async fetchPlaceDetails(placeId: string) {
    try {
      const { updatedAddress, updatedRegions } = await fetchPlaceDetails(placeId, this.addressSuggestions, this.address, this.regions);
      this.regions = updatedRegions;
      this.scChangeAddress.emit({
        ...(this.address as Address),
        ...updatedAddress,
      });
      this.showSuggestions = false;
      this.scShowAddressFields.emit();
    } catch (error) {
      createErrorNotice({
        message: sprintf(__('Google Map Error: %s', 'surecart'), error.message),
      });
    }
  }

  handleInputChange(e: any) {
    this.showSuggestions = true;
    this.value = e.target?.value;
    this.hasUnsyncedLocalValue = !!this.value;
    this.scChange.emit();
  }

  /** Sync the input value back to the parent address on change events (blur, browser autofill). */
  handleInputValueChange(e: any) {
    const newValue = e.target?.value;
    if (newValue && newValue !== this.address?.line_1) {
      this.hasUnsyncedLocalValue = false;
      this.scChangeAddress.emit({
        ...(this.address as Address),
        line_1: newValue,
      });
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    if (!this.addressSuggestions.length) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.focusedIndex = (this.focusedIndex + 1) % this.addressSuggestions.length;
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.focusedIndex = (this.focusedIndex - 1 + this.addressSuggestions.length) % this.addressSuggestions.length;
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

  hasAnyAddressField() {
    return this.address?.line_1 || this.address?.line_2 || this.address?.city || this.address?.state || this.address?.postal_code;
  }

  manualAddress() {
    this.showSuggestions = false;
    this.scShowAddressFields.emit();

    if (this.value) {
      this.scChangeAddress.emit({
        ...(this.address as Address),
        line_1: this.value,
      });
    }
  }

  handleOutsideClick(evt) {
    if (!this.showSuggestions) return;

    const path = evt.composedPath();
    if (!path.some(item => item === this.el)) {
      this.showSuggestions = false;

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
    this.boundHandleOutsideClick = evt => this.handleOutsideClick(evt);
    this.boundHandleKeyDown = evt => this.handleKeyDown(evt);

    this.handleAddressChange();

    document.addEventListener('mousedown', this.boundHandleOutsideClick);
  }

  componentDidLoad() {
    this.el.addEventListener('keydown', this.boundHandleKeyDown);
    this.toggleAddressInputs();
  }

  disconnectedCallback() {
    document.removeEventListener('mousedown', this.boundHandleOutsideClick);
    this.el.removeEventListener('keydown', this.boundHandleKeyDown);
    this.debouncedFetchAddressSuggestions.cancel();
    this.abortController?.abort();
  }

  toggleAddressInputs() {
    // Check the local input value when it hasn't been synced to the address prop yet
    // (e.g. browser autofill filled the input but the change event hasn't fired).
    const hasValue = this.address?.line_1 || (this.hasUnsyncedLocalValue && this.value);
    if (window?.scData?.google_map_api_key && !hasValue) {
      this.scHideAddressFields.emit();
    } else {
      this.scShowAddressFields.emit();
    }
  }

  /** Show address fields on focus so browser autofill can fill them. */
  handleInputFocus() {
    if (window?.scData?.google_map_api_key) {
      this.scShowAddressFields.emit();
    }
  }

  getActiveDescendantId(): string | undefined {
    return this.focusedIndex >= 0 ? `suggestion-${this.focusedIndex}` : undefined;
  }

  getSuggestionsStatusText(): string {
    if (!this.showSuggestions || !this.value) return '';
    if (this.loading) return __('Loading suggestions...', 'surecart');
    if (this.addressSuggestions.length === 0) return __('No suggestions found', 'surecart');

    // Announce the focused suggestion for screen readers.
    if (this.focusedIndex >= 0 && this.addressSuggestions[this.focusedIndex]) {
      return sprintf(
        /* translators: 1: suggestion text, 2: current position, 3: total suggestions */
        __('%1$s, %2$d of %3$d. Press Enter to select.', 'surecart'),
        this.addressSuggestions[this.focusedIndex].fullDisplayName,
        this.focusedIndex + 1,
        this.addressSuggestions.length,
      );
    }

    return sprintf(__('%d suggestions available', 'surecart'), this.addressSuggestions.length);
  }

  isSuggestionsVisible(): boolean {
    return this.showSuggestions && !!this.value;
  }

  renderAddressSuggestions() {
    if (!this.isSuggestionsVisible()) {
      return null;
    }

    return (
      <div class="sc-address__suggestions--body">
        <div class="sc-address__suggestions--scroll">
          <ul class="sc-address__suggestions--list" part="suggestions-list" role="listbox" id="address-suggestions-listbox">
            <li
              class="sc-address__suggestions--item sc-address__suggestions--item--no-select sc-address__suggestions--item--powered-by"
              part="suggestion-item powered-by"
              role="presentation"
              tabindex="-1"
            >
              <span>
                {__('Suggestions powered by ', 'surecart')}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" aria-label={__('Google Privacy Policy (opens in new tab)', 'surecart')}>
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

            {this.loading && this.addressSuggestions.length === 0 && (
              <li
                class="sc-address__suggestions--item sc-address__suggestions--item--no-select sc-address__suggestions--item--no-result"
                part="suggestion-item no-result"
                role="presentation"
                tabindex="-1"
              >
                {__('Loading...', 'surecart')}
              </li>
            )}

            {!this.loading && this.addressSuggestions.length === 0 && (
              <li
                class="sc-address__suggestions--item sc-address__suggestions--item--no-select sc-address__suggestions--item--no-result"
                part="suggestion-item no-result"
                role="presentation"
                tabindex="-1"
              >
                {__('No results found', 'surecart')}
              </li>
            )}

            {this.addressSuggestions.map((suggestion, index) => (
              <li
                id={`suggestion-${index}`}
                class={{
                  'sc-address__suggestions--item': true,
                  'focused': this.focusedIndex === index,
                }}
                part="suggestion-item"
                role="option"
                aria-selected={this.focusedIndex === index ? 'true' : 'false'}
                aria-label={sprintf(__('Select suggestion %s', 'surecart'), suggestion.fullDisplayName)}
                tabindex="-1"
                onClick={() => this.fetchPlaceDetails(suggestion?.placeId)}
                innerHTML={highlightMatch(suggestion.fullDisplayName, this.value)}
                onMouseEnter={() => (this.focusedIndex = index)}
                onMouseLeave={() => (this.focusedIndex = -1)}
              ></li>
            ))}
          </ul>
        </div>

        <div class="sc-address__suggestions--footer" part="suggestion-item manually" role="presentation">
          <button type="button" onClick={() => this.manualAddress()} aria-label={__('Enter address manually instead of using suggestions', 'surecart')}>
            {__('Enter address manually', 'surecart')}
          </button>
        </div>
      </div>
    );
  }

  render() {
    const suggestionsVisible = this.isSuggestionsVisible();

    return (
      <div part="base">
        {window?.scData?.google_map_api_key && (
          <span class="sr-only">{__('Start typing to see address suggestions. Additional fields will appear after selection.', 'surecart')}</span>
        )}

        <sc-input
          exportparts="base:input__base, input, form-control, label, help-text"
          value={this?.value}
          onScInput={(e: any) => this.handleInputChange(e)}
          onScChange={(e: any) => this.handleInputValueChange(e)}
          onFocus={() => this.handleInputFocus()}
          autocomplete="address-line1"
          placeholder={this.label}
          aria-label={this.label}
          aria-expanded={suggestionsVisible ? 'true' : 'false'}
          aria-controls={suggestionsVisible ? 'address-suggestions-listbox' : undefined}
          aria-activedescendant={this.getActiveDescendantId()}
          role="combobox"
          name={this.names?.line_1}
          disabled={this.disabled}
          required={this.required}
          {...this.inputProps}
        />

        <div role="status" aria-live="polite" aria-atomic="true" class="sr-only">
          {this.getSuggestionsStatusText()}
        </div>

        <div
          class={{
            'sc-address__suggestions': true,
            'sc-address__suggestions--visible': suggestionsVisible,
          }}
          part="suggestions"
          aria-hidden={!suggestionsVisible ? 'true' : 'false'}
        >
          {this.renderAddressSuggestions()}
        </div>
      </div>
    );
  }
}
