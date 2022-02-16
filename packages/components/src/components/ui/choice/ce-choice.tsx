import { Component, Prop, h, Event, EventEmitter, Method, State, Element, Watch } from '@stencil/core';
import { FormSubmitController } from '../../../functions/form-data';

let id = 0;

@Component({
  tag: 'ce-choice',
  styleUrl: 'ce-choice.scss',
  shadow: true,
})
export class CEChoice {
  @Element() el: HTMLCeChoiceElement;

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

  /** Emitted when the control loses focus. */
  @Event() ceBlur: EventEmitter<void>;

  /** Emitted when the control's checked state changes. */
  @Event() ceChange: EventEmitter<boolean>;

  /** Emitted when the control gains focus. */
  @Event() ceFocus: EventEmitter<void>;

  /** Simulates a click on the choice. */
  @Method()
  async triggerClick() {
    this.input.click();
  }

  /** Checks for validity and shows the browser's validation message if the control is invalid. */
  reportValidity() {
    this.invalid = !this.input.checkValidity();

    if (this.type === 'radio') {
      const choices = this.getAllChoices();
      if (!choices.some(c => c.checked)) {
        this.input.setCustomValidity('Please choose one.');
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
    this.ceChange.emit(this.input.checked);
  }

  handleBlur() {
    this.hasFocus = false;
    this.ceBlur.emit();
  }

  handleFocus() {
    this.hasFocus = true;
    this.ceFocus.emit();
  }

  /** Sets a custom validation message. If `message` is not empty, the field will be considered invalid. */
  @Method()
  async setCustomValidity(message: string) {
    this.input.setCustomValidity(message);
    this.invalid = !this.input.checkValidity();
  }

  getAllChoices() {
    const choiceGroup = this.el.closest('ce-choices');
    // Radios must be part of a radio group
    if (!choiceGroup) {
      return [];
    }
    return [...choiceGroup.querySelectorAll('ce-choice')].filter((choice: HTMLCeChoiceElement) => choice.name === this.name) as HTMLCeChoiceElement[];
  }

  getSiblingChoices() {
    return this.getAllChoices().filter(choice => choice !== this.el) as HTMLCeChoiceElement[];
  }

  handleKeyDown(event: KeyboardEvent) {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      const choices = this.getAllChoices().filter(choice => !choice.disabled);
      const incr = ['ArrowUp', 'ArrowLeft'].includes(event.key) ? -1 : 1;
      let index = choices.indexOf(this.el) + incr;
      if (index < 0) index = choices.length - 1;
      if (index > choices.length - 1) index = 0;

      this.getAllChoices().map(choice => (choice.checked = false));
      choices[index].focus();
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
    this.formController = new FormSubmitController(this, this.el, {
      value: (control: HTMLCeChoiceElement) => (control.checked ? control.value : undefined),
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
          setTimeout(() => (this.isStacked = contentBoxSize?.inlineSize < 250), 0);
        }
      }
    });
    resizeObserver.observe(this.el);
  }

  render() {
    return (
      <label
        part="base"
        class={{
          'choice': true,
          'choice--checked': this.checked,
          'choice--disabled': this.disabled,
          'choice--focused': this.hasFocus,
          'choice--layout-columns': !this.isStacked,
        }}
        htmlFor={this.inputId}
        onKeyDown={e => this.handleKeyDown(e)}
        onMouseDown={e => this.handleMouseDown(e)}
      >
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
            required={this.required}
            onClick={() => this.handleClick()}
            onBlur={() => this.handleBlur()}
            onFocus={() => this.handleFocus()}
          />
        </span>
        <span part="label" id={this.labelId} class="choice__label">
          <span class="choice__label-text" hidden={!this.showLabel}>
            <span class="choice__title" part="title">
              <slot></slot>
            </span>
            <span class="choice__description description" part="description">
              <slot name="description"></slot>
            </span>
          </span>

          <span class="choice__price" hidden={!this.showPrice}>
            <span class="choice__title">
              <slot name="price"></slot>
            </span>{' '}
            <span class="choice__description">
              <slot name="per"></slot>
            </span>
          </span>
        </span>
      </label>
    );
  }
}
