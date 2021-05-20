import { Component, Prop, h, Event, EventEmitter, Method, State, Element, Watch } from '@stencil/core';

let id = 0;

@Component({
  tag: 'presto-radio',
  styleUrl: 'presto-radio.scss',
  shadow: true,
})
export class PrestoRadio {
  @Element() el: HTMLPrestoRadioElement;

  private input: HTMLInputElement;
  private inputId: string = `radio-${++id}`;
  private labelId: string = `radio-label-${id}`;

  /** Does the radio have focus */
  @State() hasFocus: boolean = false;

  /** The radios name attribute */
  @Prop() name: string;

  /** The radios value */
  @Prop() value: string;

  /** Is the radio disabled */
  @Prop({ reflect: true, mutable: true }) disabled: boolean = false;

  /** Draws the radio in a checked state. */
  @Prop({ reflect: true, mutable: true }) checked: boolean = false;

  /** Is this required */
  @Prop({ reflect: true }) required: boolean = false;

  /** This will be true when the control is in an invalid state. Validity is determined by the `required` prop. */
  @Prop({ reflect: true, mutable: true }) invalid: boolean = false;

  /** Emitted when the control loses focus. */
  @Event() prestoBlur: EventEmitter<void>;

  /** Emitted when the control's checked state changes. */
  @Event() prestoChange: EventEmitter<void>;

  /** Emitted when the control gains focus. */
  @Event() prestoFocus: EventEmitter<void>;

  /** Simulates a click on the radio. */
  @Method()
  async prestoClick() {
    this.input.click();
  }

  /** Checks for validity and shows the browser's validation message if the control is invalid. */
  @Method()
  async reportValidity() {
    this.invalid = !this.input.checkValidity();
    return this.input.reportValidity();
  }

  @Watch('checked')
  handleCheckedChange() {
    if (this.checked) {
      this.getSiblingRadios().map(radio => (radio.checked = false));
    }
    this.input.checked = this.checked;
    this.prestoChange.emit();
  }

  handleClick() {
    this.checked = true;
  }

  handleBlur() {
    this.hasFocus = false;
    this.prestoBlur.emit();
  }

  handleFocus() {
    this.hasFocus = true;
    this.prestoFocus.emit();
  }

  /** Sets a custom validation message. If `message` is not empty, the field will be considered invalid. */
  setCustomValidity(message: string) {
    this.input.setCustomValidity(message);
    this.invalid = !this.input.checkValidity();
  }

  getAllRadios() {
    const radioGroup = this.el.closest('presto-radio-group');
    // Radios must be part of a radio group
    if (!radioGroup) {
      return [];
    }
    return [...radioGroup.querySelectorAll('presto-radio')].filter((radio: HTMLPrestoRadioElement) => radio.name === this.name) as HTMLPrestoRadioElement[];
  }

  getSiblingRadios() {
    return this.getAllRadios().filter(radio => radio !== this.el) as HTMLPrestoRadioElement[];
  }

  handleKeyDown(event: KeyboardEvent) {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      const radios = this.getAllRadios().filter(radio => !radio.disabled);
      const incr = ['ArrowUp', 'ArrowLeft'].includes(event.key) ? -1 : 1;
      let index = radios.indexOf(this.el) + incr;
      if (index < 0) index = radios.length - 1;
      if (index > radios.length - 1) index = 0;

      this.getAllRadios().map(radio => (radio.checked = false));
      radios[index].focus();
      radios[index].checked = true;

      event.preventDefault();
    }
  }

  // Prevent clicks on the label from briefly blurring the input
  handleMouseDown(event: MouseEvent) {
    event.preventDefault();
    this.input.focus();
  }

  render() {
    return (
      <label
        part="base"
        class={{
          'radio': true,
          'radio--checked': this.checked,
          'radio--disabled': this.disabled,
          'radio--focused': this.hasFocus,
        }}
        htmlFor={this.inputId}
        onKeyDown={e => this.handleKeyDown(e)}
        onMouseDown={e => this.handleMouseDown(e)}
      >
        <span part="control" class="radio__control">
          <span part="checked-icon" class="radio__icon">
            <svg viewBox="0 0 16 16">
              <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g fill="currentColor">
                  <circle cx="8" cy="8" r="3.42857143"></circle>
                </g>
              </g>
            </svg>
          </span>
          <input
            id={this.inputId}
            ref={el => (this.input = el as HTMLInputElement)}
            type="radio"
            name={this.name}
            value={this.value}
            checked={this.checked}
            disabled={this.disabled}
            required={this.required}
            aria-checked={this.checked ? 'true' : 'false'}
            aria-disabled={this.disabled ? 'true' : 'false'}
            aria-labelledby={this.labelId}
            onClick={() => this.handleClick()}
            onBlur={() => this.handleBlur()}
            onFocus={() => this.handleFocus()}
          />
        </span>
        <span part="label" id={this.labelId} class="radio__label">
          <slot></slot>
        </span>
      </label>
    );
  }
}
