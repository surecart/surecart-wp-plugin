import { Component, Prop, h, Event, EventEmitter, State, Element } from '@stencil/core';
import { PrestoMenuItem } from '../menu-item/presto-menu-item';
// import { getTextContent } from '../../../functions/slot';
let id = 0;

@Component({
  tag: 'presto-select',
  styleUrl: 'presto-select.scss',
  shadow: true,
})
export class PrestoSelect {
  @Element() el: HTMLElement;
  private input: HTMLInputElement;

  private inputId: string = `select-${++id}`;
  private helpId = `select-help-text-${id}`;
  private labelId = `select-label-${id}`;

  /** Enables multiselect. With this enabled, value will be an array. */
  @Prop({ reflect: true }) multiple: boolean = false;

  /**
   * The maximum number of tags to show when `multiple` is true. After the maximum, "+n" will be shown to indicate the
   * number of additional items that are selected. Set to -1 to remove the limit.
   */
  @Prop({ attribute: 'max-tags-visible' }) maxTagsVisible: number = 3;

  /** Disables the select control. */
  @Prop({ reflect: true }) disabled: boolean = false;

  /** The select's name. */
  @Prop() name = '';

  /** The select's placeholder text. */
  @Prop() placeholder = '';

  /** The select's size. */
  @Prop() size: 'small' | 'medium' | 'large' = 'medium';

  /** The value of the control. This will be a string or an array depending on `multiple`. */
  @Prop() value: string | Array<string> = '';

  /** Draws a pill-style select with rounded edges. */
  @Prop({ reflect: true }) pill: boolean = false;

  /** The select's label. Alternatively, you can use the label slot. */
  @Prop() label: string;

  /** The select's help text.  */
  @Prop({ attribute: 'help' }) help: string;

  /** The select's required attribute. */
  @Prop({ reflect: true }) required: boolean = false;

  /** Adds a clear button when the select is populated. */
  @Prop() clearable: boolean = false;

  /** This will be true when the control is in an invalid state. Validity is determined by the `required` prop. */
  @Prop({ reflect: true }) invalid: boolean = false;

  /** Emitted when the clear button is activated. */
  @Event() prestoClear: EventEmitter<void>;

  /** Emitted when the control's value changes. */
  @Event() prestoChange: EventEmitter<void>;

  /** Emitted when the control gains focus. */
  @Event() prestoFocus: EventEmitter<void>;

  /** Emitted when the control loses focus. */
  @Event() prestoBlur: EventEmitter<void>;

  @State() private hasFocus = false;
  @State() private isOpen = false;
  @State() private displayLabel = '';
  // @State() private displayTags: TemplateResult[] = [];

  handleMenuShow(event: CustomEvent) {
    // if (this.disabled) {
    //   event.preventDefault();
    //   return;
    // }
    console.log(event);
    this.isOpen = true;
  }

  getItems() {
    return ([...this.el.querySelectorAll('sl-menu-item')] as unknown[]) as PrestoMenuItem[];
  }

  getItemLabel(item: PrestoMenuItem) {
    console.log(item);
    // const slot = item.shadowRoot.querySelector('slot:not([name])') as HTMLSlotElement;
    // return getTextContent(PrestoMenuItem);
  }

  syncItemsFromValue() {
    const items = this.getItems();
    const value = this.getValueAsArray();

    // Sync checked states
    items.map(item => (item.checked = value.includes(item.value)));

    const checkedItem = items.filter(item => item.value === value[0])[0];

    checkedItem ? this.getItemLabel(checkedItem) : '';
    // this.displayLabel = checkedItem ? this.getItemLabel(checkedItem) : '';
    // }
  }

  getValueAsArray() {
    return Array.isArray(this.value) ? this.value : [this.value];
  }

  handleMenuHide() {
    this.isOpen = false;
  }

  handleMenuSelect(event: CustomEvent) {
    const item = event.detail.item;

    if (this.multiple) {
      this.value = this.value.includes(item.value) ? (this.value as []).filter(v => v !== item.value) : [...this.value, item.value];
    } else {
      this.value = item.value;
    }

    this.syncItemsFromValue();
  }

  handleBlur() {
    this.hasFocus = false;
    this.prestoBlur.emit();
  }

  handleFocus() {
    this.hasFocus = true;
    this.prestoFocus.emit();
  }

  handleClearClick(event: MouseEvent) {
    event.stopPropagation();
    this.value = this.multiple ? [] : '';
    this.prestoClear.emit();
    this.syncItemsFromValue();
  }

  handleKeyDown(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    console.log(target);
    return;
    // const items = this.getItems();
    // const firstItem = items[0];
    // const lastItem = items[items.length - 1];

    // // Ignore key presses on tags
    // if (target.tagName.toLowerCase() === 'sl-tag') {
    //   return;
    // }

    // // Tabbing out of the control closes it
    // if (event.key === 'Tab') {
    //   if (this.isOpen) {
    //     this.dropdown.hide();
    //   }
    //   return;
    // }

    // // Up/down opens the menu
    // if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
    //   event.preventDefault();

    //   // Show the menu if it's not already open
    //   if (!this.isOpen) {
    //     this.dropdown.show();
    //   }

    //   // Focus on a menu item
    //   if (event.key === 'ArrowDown' && firstItem) {
    //     firstItem.focus();
    //     return;
    //   }

    //   if (event.key === 'ArrowUp' && lastItem) {
    //     lastItem.focus();
    //     return;
    //   }
    // }

    // // All other keys open the menu and initiate type to select
    // if (!this.isOpen) {
    //   event.stopPropagation();
    //   event.preventDefault();
    //   this.dropdown.show();
    //   this.menu.typeToSelect(event.key);
    // }
  }

  /** Checks for validity and shows the browser's validation message if the control is invalid. */
  reportValidity() {
    return this.input.reportValidity();
  }

  render() {
    const hasSelection = this.multiple ? this.value.length > 0 : this.value !== '';

    return (
      <presto-form-control size={this.size} label={this.label} help={this.help} inputId={this.inputId} helpId={this.helpId} labelId={this.labelId}>
        <presto-dropdown
          part="base"
          closeOnSelect={!this.multiple}
          clickEl={this.el}
          class={{
            'select': true,
            'select--open': this.isOpen,
            'select--empty': this.value?.length === 0,
            'select--focused': this.hasFocus,
            'select--clearable': this.clearable,
            'select--disabled': this.disabled,
            'select--multiple': this.multiple,
            // 'select--has-tags': this.multiple && this.displayTags.length > 0,
            'select--placeholder-visible': this.displayLabel === '',
            'select--small': this.size === 'small',
            'select--medium': this.size === 'medium',
            'select--large': this.size === 'large',
            'select--pill': this.pill,
            'select--invalid': this.invalid,
          }}
          onPrestoShow={e => this.handleMenuShow(e)}
          onPrestoHide={() => this.handleMenuHide()}
        >
          <div
            slot="trigger"
            id={this.inputId}
            class="select__box"
            role="combobox"
            aria-haspopup="true"
            aria-expanded={this.isOpen ? 'true' : 'false'}
            tabindex={this.disabled ? '-1' : '0'}
            onBlur={() => this.handleBlur()}
            onFocus={() => this.handleFocus()}
            onKeyDown={e => this.handleKeyDown(e)}
          >
            <div class="select__label">{this.displayLabel || this.placeholder}</div>
            {this.clearable && hasSelection ? (
              <sl-icon-button exportparts="base:clear-button" class="select__clear" name="x-circle" library="system" onClick={this.handleClearClick} tabindex="-1"></sl-icon-button>
            ) : (
              ''
            )}
          </div>

          <presto-menu part="menu" class="select__menu">
            <slot></slot>
          </presto-menu>
        </presto-dropdown>

        {/*The hidden input tricks the browser's built-in validation so it works as expected. We use an input
            instead of a select because, otherwise, iOS will show a list of options during validation. */}
        <input
          ref={el => (this.input = el as HTMLInputElement)}
          class="select__hidden-select"
          aria-hidden="true"
          required={this.required}
          value={hasSelection ? '1' : ''}
          tabindex="-1"
        />
      </presto-form-control>
    );
  }
}
