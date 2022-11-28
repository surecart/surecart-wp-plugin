import { Component, Prop, h, Event, EventEmitter, Method, State, Element, Watch } from '@stencil/core';
import { FormSubmitController } from '../../../functions/form-data';

let id = 0;

@Component({
  tag: 'sc-radio',
  styleUrl: 'sc-radio.scss',
  shadow: true,
})
export class ScRadio {
  @Element() el: HTMLScRadioElement;
  private input: HTMLInputElement;
  private formController: any;
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

  /** This will be true as a workaround in the block editor to focus on the content. */
  @Prop() edit: boolean;

  /** Emitted when the control loses focus. */
  @Event() scBlur: EventEmitter<void>;

  /** Emitted when the control's checked state changes. */
  @Event() scChange: EventEmitter<void>;

  /** Emitted when the control gains focus. */
  @Event() scFocus: EventEmitter<void>;

  /** Simulates a click on the radio. */
  @Method()
  async ceClick() {
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
    this.scChange.emit();
  }

  handleClick() {
    this.checked = true;
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
  setCustomValidity(message: string) {
    this.input.setCustomValidity(message);
    this.invalid = !this.input.checkValidity();
  }

  getAllRadios() {
    const radioGroup = this.el.closest('sc-radio-group');
    // Radios must be part of a radio group
    if (!radioGroup) {
      return [];
    }
    return [...radioGroup.querySelectorAll('sc-radio')] as HTMLScRadioElement[];
  }

  getSiblingRadios() {
    return this.getAllRadios().filter(radio => radio !== this.el) as HTMLScRadioElement[];
  }

  handleKeyDown(event: KeyboardEvent) {
    if (this.edit) return true;

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
    if (this.edit) return true;
    event.preventDefault();
    this.input.focus();
  }

  componentDidLoad() {
    this.formController = new FormSubmitController(this.el, {
      value: (control: HTMLScChoiceElement) => (control.checked ? control.value : undefined),
    }).addFormData();
  }

  disconnectedCallback() {
    this.formController?.removeFormData();
  }

  render() {
    const Tag = this.edit ? 'div' : 'label';
    return (
      <Tag
        part="base"
        class={{
          'radio': true,
          'radio--checked': this.checked,
          'radio--disabled': this.disabled,
          'radio--focused': this.hasFocus,
          'radio--editing': this.edit,
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
      </Tag>
    );
  }
}
