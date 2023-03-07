import { Component, Prop, h, Event, EventEmitter, Method, State, Element, Watch, Host } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { FormSubmitController } from '../../../functions/form-data';
import { isRtl } from '../../../functions/page-align';

let id = 0;

@Component({
  tag: 'sc-choice',
  styleUrl: 'sc-choice.scss',
  shadow: true,
})
export class ScChoice {
  @Element() el: HTMLScChoiceElement;

  private formController: any;

  private input: HTMLInputElement;
  private inputId: string = `choice-${++id}`;
  private labelId: string = `choice-label-${id}`;

  /** Does the choice have focus */
  @State() hasFocus: boolean = false;

  /** Does the choice have focus */
  @State() isStacked: boolean = false;

  /** The choice name attribute */
  @Prop() name: string;

  /** The size. */
  @Prop() size: 'small' | 'medium' | 'large' = 'medium';

  /** The choice value */
  @Prop({ reflect: true }) value: string;

  /** The choice name attribute */
  @Prop() type: 'radio' | 'checkbox' = 'radio';

  /** Is the choice disabled */
  @Prop({ reflect: true, mutable: true }) disabled: boolean = false;

  /** Draws the choice in a checked state. */
  @Prop({ reflect: true, mutable: true }) checked: boolean = false;

  /** Is this required */
  @Prop({ reflect: true }) required: boolean = false;

  /** This will be true when the control is in an invalid state. Validity is determined by the `required` prop. */
  @Prop({ reflect: true, mutable: true }) invalid: boolean = false;

  /** Show the label */
  @Prop() showLabel: boolean = true;

  /** Show the price */
  @Prop() showPrice: boolean = true;

  /** Show the radio/checkbox control */
  @Prop() showControl: boolean = true;

  @State() hasDefaultSlot: boolean;
  @State() hasPrice: boolean;
  @State() hasPer: boolean;
  @State() hasDescription: boolean;

  /** Emitted when the control loses focus. */
  @Event() scBlur: EventEmitter<void>;

  /** Emitted when the control's checked state changes. */
  @Event() scChange: EventEmitter<boolean>;

  /** Emitted when the control gains focus. */
  @Event() scFocus: EventEmitter<void>;

  /** Simulates a click on the choice. */
  @Method()
  async triggerClick() {
    this.input.click();
  }

  @Method()
  async triggerFocus() {
    this.input.focus();
  }

  /** Checks for validity and shows the browser's validation message if the control is invalid. */
  @Method()
  async reportValidity() {
    this.invalid = !this.input.checkValidity();

    if (this.required) {
      const choices = this.getAllChoices();
      if (!choices.some(c => c.checked)) {
        this.input.setCustomValidity(this.type === 'radio' ? __('Please choose one.', 'surecart') : __('Please choose at least one.', 'surecart'));
        this.invalid = !this.input.checkValidity();
      } else {
        this.input.setCustomValidity('');
        this.invalid = !this.input.checkValidity();
      }
    }

    return this.input.reportValidity();
  }

  @Watch('checked')
  handleCheckedChange() {
    this.input.setCustomValidity('');
    if (this.type === 'radio' && this.checked) {
      this.getSiblingChoices().map(choice => (choice.checked = false));
    }
    this.input.checked = this.checked;
  }

  handleClick() {
    if (this.type === 'checkbox') {
      this.checked = !this.checked;
    } else {
      this.checked = true;
    }
    // we only want to emit this when an action is actually taken
    this.scChange.emit(this.input.checked);
  }

  handleBlur() {
    this.hasFocus = false;
    this.scBlur.emit();
  }

  handleFocus() {
    this.hasFocus = true;
    this.scFocus.emit();
  }

  /** Sets a custom validation message. If `message` is not empty, the field will be considered invalid. */
  @Method()
  async setCustomValidity(message: string) {
    this.input.setCustomValidity(message);
    this.invalid = !this.input.checkValidity();
  }

  getAllChoices() {
    const choiceGroup = this.el.closest('sc-choices') || this.el.parentElement;
    // Radios must be part of a radio group
    if (!choiceGroup) {
      return [];
    }
    return [...choiceGroup.querySelectorAll('sc-choice')] as HTMLScChoiceElement[];
  }

  getSiblingChoices() {
    return this.getAllChoices().filter(choice => choice !== this.el) as HTMLScChoiceElement[];
  }

  handleKeyDown(event: KeyboardEvent) {
    // On arrow key press
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      const choices = this.getAllChoices().filter(choice => !choice.disabled);
      const incr = ['ArrowUp', 'ArrowLeft'].includes(event.key) ? -1 : 1;
      let index = choices.indexOf(this.el) + incr;
      if (index < 0) index = choices.length - 1;
      if (index > choices.length - 1) index = 0;

      choices[index].triggerFocus();
      choices[index].checked = true;

      event.preventDefault();
    }
  }

  // Prevent clicks on the label from briefly blurring the input
  handleMouseDown(event: MouseEvent) {
    event.preventDefault();
    this.input.focus();
  }

  componentDidLoad() {
    this.handleResize();
    this.formController = new FormSubmitController(this.el, {
      value: (control: HTMLScChoiceElement) => (control.checked ? control.value : undefined),
    }).addFormData();
  }

  disconnectedCallback() {
    this.formController?.removeFormData();
  }

  handleResize() {
    if (!window?.ResizeObserver) {
      return;
    }
    const resizeObserver = new window.ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.contentBoxSize) {
          const contentBoxSize = Array.isArray(entry.contentBoxSize) ? entry.contentBoxSize[0] : entry.contentBoxSize;
          setTimeout(() => (this.isStacked = contentBoxSize?.inlineSize < 350), 0);
        }
      }
    });
    resizeObserver.observe(this.el);
  }

  handleSlotChange() {
    this.hasPrice = !!this.el.querySelector('[slot="price"]');
    this.hasPer = !!this.el.querySelector('[slot="per"]');
    this.hasDescription = !!this.el.querySelector('[slot="description"]');
    this.hasDefaultSlot = !!this.el.querySelector('[slot="default"]');
  }

  render() {
    return (
      <Host tabindex="0" onFocus={() => this.input.focus()}>
        <div
          part="base"
          class={{
            'choice': true,
            'choice--checked': this.checked,
            'choice--disabled': this.disabled,
            'choice--focused': this.hasFocus,
            'choice--layout-columns': !this.isStacked,
            'choice--is-rtl': isRtl(),
            [`choice--size-${this.size}`]: true,
          }}
          onKeyDown={e => this.handleKeyDown(e)}
          onMouseDown={e => this.handleMouseDown(e)}
        >
          <slot name="header" />
          <label class="choice__content" part="content" htmlFor={this.inputId}>
            <span
              part="control"
              class={{
                choice__control: true,
                choice__checkbox: this.type === 'checkbox',
                choice__radio: this.type === 'radio',
              }}
              hidden={!this.showControl}
            >
              <span part="checked-icon" class="choice__icon">
                {this.type === 'checkbox' ? (
                  <svg viewBox="0 0 16 16">
                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
                      <g stroke="currentColor" stroke-width="2">
                        <g transform="translate(3.428571, 3.428571)">
                          <path d="M0,5.71428571 L3.42857143,9.14285714"></path>
                          <path d="M9.14285714,0 L3.42857143,9.14285714"></path>
                        </g>
                      </g>
                    </g>
                  </svg>
                ) : (
                  <svg viewBox="0 0 16 16">
                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g fill="currentColor">
                        <circle cx="8" cy="8" r="3.42857143"></circle>
                      </g>
                    </g>
                  </svg>
                )}
              </span>
              <input
                id={this.inputId}
                ref={el => (this.input = el as HTMLInputElement)}
                type={this.type}
                name={this.name}
                value={this.value}
                checked={this.checked}
                disabled={this.disabled}
                aria-checked={this.checked ? 'true' : 'false'}
                aria-disabled={this.disabled ? 'true' : 'false'}
                aria-labelledby={this.labelId}
                tabindex="0"
                // required={this.required}
                onClick={() => this.handleClick()}
                onBlur={() => this.handleBlur()}
                onFocus={() => this.handleFocus()}
              />
            </span>
            <span part="label" id={this.labelId} class="choice__label">
              <span class="choice__label-text" hidden={!this.showLabel}>
                <span class="choice__title" part="title">
                  <slot onSlotchange={() => this.handleSlotChange()}></slot>
                </span>
                <span class="choice__description description" part="description" hidden={!this.hasDescription}>
                  <slot name="description" onSlotchange={() => this.handleSlotChange()}></slot>
                </span>
              </span>

              <span class="choice__price" hidden={!this.showPrice || (!this.hasPrice && !this.hasPer)}>
                <span class="choice__title">
                  <slot name="price" onSlotchange={() => this.handleSlotChange()}></slot>
                </span>{' '}
                <span class="choice__description">
                  <slot name="per" onSlotchange={() => this.handleSlotChange()}></slot>
                </span>
              </span>
            </span>
          </label>
          <slot name="footer" />
        </div>
      </Host>
    );
  }
}
