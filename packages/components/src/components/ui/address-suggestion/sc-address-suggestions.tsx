/**
 * External dependencies.
 */
import { Component, Element, Event, EventEmitter, h, Method, Prop, State, Watch } from '@stencil/core';
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

  /** Reference to the inner sc-input so we can delegate validation to it — the browser's native constraint
   *  validation can't see this input since it isn't form-associated. */
  private input: HTMLScInputElement;

  private boundHandleKeyDown: (e: KeyboardEvent) => void;
  private boundHandleOutsideClick: (e: Event) => void;
  private abortController: AbortController;
  /** Tracks whether the local value was set by user input / browser autofill and hasn't been synced to the address prop yet. */
  private hasUnsyncedLocalValue: boolean = false;

  @Prop() address: Partial<Address> = {
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

  /** Whether the suggestions dropdown is visible. */
  @State() showSuggestions: boolean = false;

  /** Loading state for suggestions */
  @State() loading: boolean = false;

  /** Address changed — emitted to parent to update address state. */
  @Event() scChangeAddress: EventEmitter<Address>;

  /** Event to show address fields manually */
  @Event() scShowAddressFields: EventEmitter<void>;

  /** Event to hide address fields */
  @Event() scHideAddressFields: EventEmitter<void>;

  /** Focused index for keyboard navigation */
  @State() focusedIndex: number = -1;

  /** Delegates to the inner sc-input so this field participates in form validation
   *  (it was previously skipped entirely, allowing required addresses through empty). */
  @Method()
  async reportValidity() {
    return this.input ? this.input.reportValidity() : true;
  }

  /** Whether Google Maps autocomplete is active. */
  isGoogleMapsActive(): boolean {
    return !!window?.scData?.google_map_api_key;
  }

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
  handleValueChange(newValue: string) {
    // Only fetch suggestions for user input, not prop syncs.
    if (!this.hasUnsyncedLocalValue) return;
    if (!this.address?.country) return;
    if (newValue && this.showSuggestions) {
      this.debouncedFetchAddressSuggestions(newValue);
    }
  }

  /** Close the suggestions list and cancel in-flight fetch. */
  private closeSuggestionsDropdown() {
    this.showSuggestions = false;
    this.addressSuggestions = [];
    this.focusedIndex = -1;
    this.debouncedFetchAddressSuggestions.cancel();
    this.abortController?.abort();
  }

  @Watch('address')
  handleAddressChange() {
    if (!this.address?.country) return;

    if (this.showSuggestions) {
      this.closeSuggestionsDropdown();
    }

    // Only preserve the local value if it was set by user input / browser
    // autofill and hasn't been synced to the address prop yet.
    // Otherwise always sync from the address prop (e.g. country change clears fields).
    if (this.hasUnsyncedLocalValue && !this.address.line_1) {
      // Keep current local value — browser autofill hasn't synced yet.
    } else {
      // Set flag before value so the @Watch('value') sees it correctly.
      this.hasUnsyncedLocalValue = false;
      this.value = this.address.line_1 || '';
    }

    this.updateFieldVisibility();
  }

  /** Emit an address update to the parent, merging changes with current address. */
  private emitAddressUpdate(changes: Partial<Address>) {
    this.scChangeAddress.emit({
      ...(this.address as Address),
      ...changes,
    });
  }

  /** Select a suggestion by place ID — used by both click and keyboard. */
  async selectSuggestion(placeId: string) {
    // Cancel any queued/in-flight suggestions fetch so a stale response can't overwrite state after we close.
    this.debouncedFetchAddressSuggestions.cancel();
    this.abortController?.abort();
    try {
      const { updatedAddress, updatedRegions } = await fetchPlaceDetails(placeId, this.addressSuggestions, this.address, this.regions);
      this.regions = updatedRegions;
      this.closeSuggestionsDropdown();
      this.scChangeAddress.emit(updatedAddress as Address);
      this.scShowAddressFields.emit();
    } catch (error) {
      createErrorNotice({
        message: sprintf(__('Google Map Error: %s', 'surecart'), error.message),
      });
    }
  }

  handleInputChange(e: any) {
    if (this.isGoogleMapsActive()) {
      this.showSuggestions = true;
    }

    // Must set before assigning value — the @Watch('value') handler reads this flag synchronously.
    this.hasUnsyncedLocalValue = !!e.target?.value;
    this.value = e.target?.value;
  }

  /** Sync the input value back to the parent address on change events (blur, browser autofill). */
  handleInputValueChange(e: any) {
    const newValue = e.target?.value;
    if (newValue && newValue !== this.address?.line_1) {
      this.hasUnsyncedLocalValue = false;
      this.closeSuggestionsDropdown();
      this.emitAddressUpdate({ line_1: newValue });
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
          this.selectSuggestion(this.addressSuggestions[this.focusedIndex].placeId);
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

    if (this.value) {
      this.emitAddressUpdate({ line_1: this.value });
    }
  }

  handleOutsideClick(evt) {
    if (!this.showSuggestions) return;

    const path = evt.composedPath();
    if (!path.some(item => item === this.el)) {
      this.showSuggestions = false;

      if (this.value) {
        this.scShowAddressFields.emit();
        this.emitAddressUpdate({ line_1: this.value });
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
    this.updateFieldVisibility();
  }

  disconnectedCallback() {
    document.removeEventListener('mousedown', this.boundHandleOutsideClick);
    this.el.removeEventListener('keydown', this.boundHandleKeyDown);
    this.debouncedFetchAddressSuggestions.cancel();
    this.abortController?.abort();
  }

  /** Tell the parent whether to show or hide the collapsible address fields. */
  updateFieldVisibility() {
    if (!this.isGoogleMapsActive()) return; // Not our concern — parent shows all fields.

    const hasValue = this.address?.line_1 || (this.hasUnsyncedLocalValue && this.value);
    if (hasValue) {
      this.scShowAddressFields.emit();
    } else {
      this.scHideAddressFields.emit();
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
                onMouseDown={e => e.preventDefault()}
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
                onMouseDown={e => e.preventDefault()}
                onClick={() => this.selectSuggestion(suggestion?.placeId)}
                innerHTML={highlightMatch(suggestion.fullDisplayName, this.value)}
                onMouseEnter={() => (this.focusedIndex = index)}
                onMouseLeave={() => (this.focusedIndex = -1)}
              ></li>
            ))}
          </ul>
        </div>

        <div class="sc-address__suggestions--footer" part="suggestion-item manually" role="presentation">
          <button
            type="button"
            onMouseDown={e => e.preventDefault()}
            onClick={() => this.manualAddress()}
            aria-label={__('Enter address manually instead of using suggestions', 'surecart')}
          >
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
        {this.isGoogleMapsActive() && <span class="sr-only">{__('Start typing to see address suggestions, or select one to auto-fill your address.', 'surecart')}</span>}

        <sc-input
          ref={el => (this.input = el as HTMLScInputElement)}
          exportparts="base:input__base, input, form-control, label, help-text"
          value={this?.value}
          onScInput={(e: any) => this.handleInputChange(e)}
          onScChange={(e: any) => this.handleInputValueChange(e)}
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
