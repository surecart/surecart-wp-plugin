import { Component, Prop, h, State, Watch, Event, EventEmitter, Method, Element, Listen } from '@stencil/core';
import { ChoiceItem } from '../../../types';
import Fuse from 'fuse.js';
import { FormSubmitController } from '../../../functions/form-data';
import { __ } from '@wordpress/i18n';
import { isValidURL } from '../../../functions/util';

let id = 0;

@Component({
  tag: 'sc-select',
  styleUrl: 'sc-select.scss',
  shadow: true,
})
export class ScSelectDropdown {
  /** Element */
  @Element() el: HTMLScSelectElement;

  private formController: any;

  private searchInput: HTMLScInputElement;
  private input: HTMLInputElement;
  private menu: HTMLScMenuElement;

  private inputId: string = `select-${++id}`;
  private helpId = `select-help-text-${id}`;
  private labelId = `select-label-${id}`;

  /** The input's autocomplete attribute. */
  @Prop() autocomplete: string;

  /** Placeholder for no value */
  @Prop() placeholder: string = '';

  /** Placeholder for search */
  @Prop() searchPlaceholder: string = '';

  /** The input's value attribute. */
  @Prop({ mutable: true }) value = '';

  /** The input's value attribute. */
  @Prop({ mutable: true }) choices: Array<ChoiceItem> = [];

  /* Is it required */
  @Prop({ reflect: true }) required: boolean;

  /* Is it loading */
  @Prop() loading: boolean;

  /** Is search enabled? */
  @Prop() search: boolean;

  /** The input's name attribute. */
  @Prop() name: string;

  /** Some help text for the input. */
  @Prop() help: string;

  /** The input's label. */
  @Prop() label: string;

  /** The input's size. */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  @Prop() position: 'bottom-left' | 'bottom-right' = 'bottom-right';

  /**
   * This will be true when the control is in an invalid state. Validity is determined by props such as `type`,
   * `required`, `minlength`, `maxlength`, and `pattern` using the browser's constraint validation API.
   */
  @Prop({ mutable: true, reflect: true }) invalid = false;

  /** Is this open */
  @Prop({ mutable: true }) open: boolean;
  @Prop() disabled: boolean;
  @Prop() showParentLabel: boolean = true;

  @Prop() squared: boolean;
  @Prop() squaredBottom: boolean;
  @Prop() squaredTop: boolean;
  @Prop() squaredLeft: boolean;
  @Prop() squaredRight: boolean;

  @State() private hasFocus: boolean = false;

  /** Search term */
  @State() searchTerm: string = '';

  /** Search term */
  @State() filteredChoices: Array<ChoiceItem> = [];

  /** Emitted whent the components search query changes */
  @Event() scSearch: EventEmitter<string>;

  /** Emitted whent the components search query changes */
  @Event() scOpen: EventEmitter<string>;

  /** Emitted whent the components search query changes */
  @Event() scClose: EventEmitter<string>;

  /** Emitted when the control loses focus. */
  @Event() scBlur: EventEmitter<void>;

  /** Emitted when the control gains focus. */
  @Event() scFocus: EventEmitter<void>;

  /** Emitted when the control's value changes. */
  @Event({ composed: true })
  scChange: EventEmitter<void>;

  /** Trigger focus on show */
  handleShow() {
    this.open = true;
    this.scOpen.emit();
    setTimeout(() => {
      this.searchInput.triggerFocus();
    }, 50);
  }

  handleHide() {
    this.open = false;
    this.scClose.emit();
  }

  handleBlur() {
    this.hasFocus = false;
    this.scBlur.emit();
  }

  handleFocus() {
    this.hasFocus = true;
    this.scFocus.emit();
  }

  /** Get the display value of the item. */
  displayValue() {
    if (!this.value) return false;
    let chosen = this.choices.find(choice => choice.value == this.value);
    let append = '';
    if (!chosen) {
      if (this.showParentLabel) {
        append = this.choices.find(choice => choice.choices.some(subChoice => subChoice.value === this.value))?.label;
      }
      const subchoices = (this.choices || []).map(choice => choice.choices).flat();
      chosen = subchoices.find(choice => choice?.value == this.value);
    }
    if (chosen) {
      return `${append ? append + ' - ' : ''}${chosen?.label}`;
    }
    return false;
  }

  isChecked({ value }) {
    return this.value === value;
  }

  /** Sets a custom validation message. If `message` is not empty, the field will be considered invalid. */
  @Method()
  async setCustomValidity(message: string) {
    this.input.setCustomValidity(message);
    this.invalid = !this.input.checkValidity();
  }

  @Method()
  async reportValidity() {
    return this.input.reportValidity();
  }

  handleQuery(e) {
    this.searchTerm = e.target.value;
    this.scSearch.emit(this.searchTerm);
  }

  handleSelect(value) {
    if (this.value === value) {
      this.value = '';
    } else {
      this.value = value;
    }

    this.scChange.emit();
  }

  @Watch('searchTerm')
  @Watch('choices')
  handleSearchChange() {
    const fuse = new Fuse(this.choices, {
      keys: ['value', 'label'],
    });

    if (this.searchTerm) {
      const results = fuse.search(this.searchTerm) as any;
      this.filteredChoices = results.map(result => result.item);
    } else {
      this.filteredChoices = this.choices;
    }
  }

  @Watch('value')
  handleValueChange() {
    this.invalid = !this.input.checkValidity();
  }

  @Watch('open')
  handleOpenChange() {
    if (this.open) {
      this.scOpen.emit();
      this.searchInput && this.searchInput.triggerFocus();
    } else {
      this.scClose.emit();
    }
  }

  componentWillLoad() {
    this.handleSearchChange();
  }

  componentDidLoad() {
    this.formController = new FormSubmitController(this.el).addFormData();
    if (this.open) {
      this.searchInput.triggerFocus();
    }
  }

  getItems() {
    return [...this.el.shadowRoot.querySelectorAll<HTMLScMenuItemElement>('sc-menu-item')];
  }

  @Listen('keydown')
  handleKeyDown(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    const items = this.getItems();
    const firstItem = items[0];
    const lastItem = items[items.length - 1];

    // Ignore key presses on tags
    if (target.tagName.toLowerCase() === 'sc-tag') {
      return;
    }

    // Tabbing out of the control closes it
    if (event.key === 'Tab') {
      if (this.open) {
        this.handleHide();
      }
      return;
    }

    // Up/down opens the menu
    if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault();

      // Show the menu if it's not already open
      if (!this.open) {
        this.handleShow();
      }

      // Focus on a menu item
      if (event.key === 'ArrowDown') {
        this.menu.setCurrentItem(firstItem);
        firstItem.setFocus();
        return;
      }

      if (event.key === 'ArrowUp') {
        this.menu.setCurrentItem(lastItem);
        lastItem.setFocus();
        return;
      }
    }

    // don't open the menu when a CTRL/Command key is pressed
    if (event.ctrlKey || event.metaKey) {
      return;
    }

    // All other "printable" keys open the menu and initiate type to select
    if (!this.open && event.key.length === 1) {
      this.handleShow();
    }
  }

  disconnectedCallback() {
    this.formController?.removeFormData();
  }

  renderIcon(icon) {
    if (isValidURL(icon)) {
      return <img src={icon} alt="icon" slot="prefix" class="choice__icon--image" />;
    }
    return <sc-icon name={icon} slot="prefix" class="choice__icon" />;
  }

  renderItem(choice: ChoiceItem, index: number) {
    if (choice?.choices?.length) {
      return <sc-menu-label key={index}>{choice.label}</sc-menu-label>;
    }

    return (
      <sc-menu-item key={index} checked={this.isChecked(choice)} onClick={() => this.handleSelect(choice.value)} disabled={choice.disabled}>
        {choice.label}
        {!!choice?.suffix && <span slot="suffix">{choice.suffix}</span>}
        {!!choice?.icon && this.renderIcon(choice.icon)}
      </sc-menu-item>
    );
  }

  render() {
    return (
      <div
        class={{
          'select': true,
          'select--placeholder': !this.value,
          'select--focused': this.hasFocus,
          'select--is-open': !!this.open,
          'select--disabled': this.disabled,
          'select--has-choices': !!this?.choices?.length,
          'select--squared': this.squared,
          'select--squared-bottom': this.squaredBottom,
          'select--squared-top': this.squaredTop,
          'select--squared-left': this.squaredLeft,
          'select--squared-right': this.squaredRight,
        }}
      >
        <sc-form-control
          size={this.size}
          required={this.required}
          label={this.label}
          help={this.help}
          inputId={this.inputId}
          helpId={this.helpId}
          labelId={this.labelId}
          name={this.name}
        >
          <input
            class="select__hidden-input"
            onBlur={() => this.handleBlur()}
            onFocus={() => this.handleFocus()}
            name={this.name}
            ref={el => (this.input = el as HTMLInputElement)}
            value={this.value}
            required={this.required}
            disabled={this.disabled}
          ></input>

          <sc-dropdown
            disabled={this.disabled}
            open={this.open}
            position={this.position}
            style={{ '--panel-width': '100%' }}
            onScShow={() => this.handleShow()}
            onScHide={() => this.handleHide()}
          >
            <div class="trigger" slot="trigger">
              <div class="select__value">{this.displayValue() || this.placeholder || 'Select...'}</div>
              <sc-icon part="caret" class="select__caret" name="chevron-down" />
            </div>

            {this.search && (
              <sc-input
                placeholder={this.searchPlaceholder || 'Search...'}
                onScInput={e => this.handleQuery(e)}
                class="search"
                clearable
                part="search"
                ref={el => (this.searchInput = el as HTMLScInputElement)}
              >
                {this.loading && <sc-spinner style={{ '--spinner-size': '0.5em' }} slot="suffix"></sc-spinner>}
              </sc-input>
            )}

            <sc-menu style={{ maxHeight: '210px', overflow: 'auto' }} ref={el => (this.menu = el as HTMLScMenuElement)}>
              <slot name="prefix"></slot>
              {this.loading && !this.filteredChoices.length && (
                <div class="loading">
                  <sc-spinner></sc-spinner>
                </div>
              )}
              {(this.filteredChoices || []).map((choice, index) => {
                return [this.renderItem(choice, index), (choice.choices || []).map(choice => this.renderItem(choice, index))];
              })}
              {!this.loading && !this.filteredChoices.length && <div class="select__empty">{__('Nothing Found', 'surecart')}</div>}
              <slot name="suffix"></slot>
            </sc-menu>
          </sc-dropdown>
        </sc-form-control>
      </div>
    );
  }
}
