import { Component, Prop, h, State, Watch, Event, EventEmitter, Method, Element } from '@stencil/core';
import { ChoiceItem } from '../../../types';
import Fuse from 'fuse.js';
import { FormSubmitController } from '../../../functions/form-data';

@Component({
  tag: 'ce-select',
  styleUrl: 'ce-select.scss',
  shadow: true,
})
export class CeSelectDropdown {
  /** Element */
  @Element() el: HTMLCeSelectElement;

  private formController: any;

  private searchInput: HTMLCeInputElement;
  private input: HTMLInputElement;

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

  @Prop() position: 'bottom-left' | 'bottom-right' = 'bottom-right';

  /**
   * This will be true when the control is in an invalid state. Validity is determined by props such as `type`,
   * `required`, `minlength`, `maxlength`, and `pattern` using the browser's constraint validation API.
   */
  @Prop({ mutable: true, reflect: true }) invalid = false;

  /** Is this open */
  @Prop({ mutable: true }) open: boolean;

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
  @Event() ceSearch: EventEmitter<string>;

  /** Emitted whent the components search query changes */
  @Event() ceOpen: EventEmitter<string>;

  /** Emitted whent the components search query changes */
  @Event() ceClose: EventEmitter<string>;

  /** Emitted when the control loses focus. */
  @Event() ceBlur: EventEmitter<void>;

  /** Emitted when the control gains focus. */
  @Event() ceFocus: EventEmitter<void>;

  /** Emitted when the control's value changes. */
  @Event({ composed: true })
  ceChange: EventEmitter<void>;

  /** Trigger focus on show */
  handleShow() {
    this.open = true;
    this.ceOpen.emit();
    setTimeout(() => {
      this.searchInput.triggerFocus();
    }, 50);
  }

  handleHide() {
    this.open = false;
    this.ceClose.emit();
  }

  handleBlur() {
    this.hasFocus = false;
    this.ceBlur.emit();
  }

  handleFocus() {
    this.hasFocus = true;
    this.ceFocus.emit();
  }

  /** Get the display value of the item. */
  displayValue() {
    let chosen = this.choices.find(choice => choice.value == this.value);
    if (!chosen) {
      const subchoices = (this.choices || []).map(choice => choice.choices).flat();
      chosen = subchoices.find(choice => choice?.value == this.value);
    }
    return chosen?.label;
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

  @Method('reportValidity')
  async reportValidity() {
    return this.input.reportValidity();
  }

  handleQuery(e) {
    this.searchTerm = e.target.value;
    this.ceSearch.emit(this.searchTerm);
  }

  handleSelect(value) {
    if (this.value === value) {
      this.value = '';
    } else {
      this.value = value;
    }

    this.ceChange.emit();
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
      this.ceOpen.emit();
      this.searchInput && this.searchInput.triggerFocus();
    } else {
      this.ceClose.emit();
    }
  }

  componentWillLoad() {
    this.handleSearchChange();
  }

  componentDidLoad() {
    this.formController = new FormSubmitController(this.el);
    this.formController.addFormData(this.el);
    if (this.open) {
      this.searchInput.triggerFocus();
    }
  }

  disconnectedCallback() {
    this.formController.removeFormData(this.el);
  }

  renderItem(choice: ChoiceItem) {
    if (choice?.choices?.length) {
      return <ce-menu-label>{choice.label}</ce-menu-label>;
    }

    return (
      <ce-menu-item checked={this.isChecked(choice)} onClick={() => this.handleSelect(choice.value)} disabled={choice.disabled}>
        {choice.label}
        {choice?.suffix && <span slot="suffix">{choice.suffix}</span>}
      </ce-menu-item>
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
          'select--has-choices': !!this?.choices?.length,
          'select--squared': this.squared,
          'select--squared-bottom': this.squaredBottom,
          'select--squared-top': this.squaredTop,
          'select--squared-left': this.squaredLeft,
          'select--squared-right': this.squaredRight,
        }}
      >
        <input
          class="select__hidden-input"
          onBlur={() => this.handleBlur()}
          onFocus={() => this.handleFocus()}
          name={this.name}
          ref={el => (this.input = el as HTMLInputElement)}
          value={this.value}
          required={this.required}
        ></input>

        <ce-dropdown open={this.open} position={this.position} style={{ '--panel-width': '100%' }} onCeShow={() => this.handleShow()} onCeHide={() => this.handleHide()}>
          <div class="trigger" slot="trigger">
            <div class="select__value">{this.displayValue() || this.placeholder || 'Select...'}</div>
            <ce-icon part="caret" class="select__caret" name="chevron-down" />
          </div>

          {this.search && (
            <ce-input
              placeholder={this.searchPlaceholder || 'Search...'}
              onCeInput={e => this.handleQuery(e)}
              class="search"
              clearable
              part="search"
              ref={el => (this.searchInput = el as HTMLCeInputElement)}
            >
              {this.loading && <ce-spinner style={{ '--spinner-size': '0.5em' }} slot="suffix"></ce-spinner>}
            </ce-input>
          )}

          <ce-menu style={{ maxHeight: '210px', overflow: 'auto' }}>
            <slot name="prefix"></slot>
            {this.loading && !this.filteredChoices.length && (
              <div class="loading">
                <ce-spinner></ce-spinner>
              </div>
            )}
            {(this.filteredChoices || []).map((choice, index) => {
              return (
                <div key={index}>
                  {this.renderItem(choice)}
                  {(choice.choices || []).map(choice => this.renderItem(choice))}
                </div>
              );
            })}
            {this.searchTerm && !this.loading && !this.filteredChoices.length && <div class="select__empty">{'Nothing Found'}</div>}
            <slot name="suffix"></slot>
          </ce-menu>
        </ce-dropdown>
      </div>
    );
  }
}
