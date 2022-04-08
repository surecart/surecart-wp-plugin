import { Component, Prop, State, h, Event, EventEmitter, Method, Watch, Element } from '@stencil/core';
import { FormSubmitController } from '../../../functions/form-data';

let id = 0;

@Component({
  tag: 'sc-checkbox',
  styleUrl: 'sc-checkbox.scss',
  shadow: true,
})
export class ScCheckbox {
  @Element() el: HTMLScCheckboxElement;
  private input: HTMLInputElement;
  private formController: any;
  private inputId = `checkbox-${++id}`;
  private labelId = `checkbox-label-${id}`;

  @State() private hasFocus: boolean = false;

  /** The checkbox's name attribute. */
  @Prop() name: string;

  /** The checkbox's value attribute. */
  @Prop() value: string;

  /** Disables the checkbox. */
  @Prop({ reflect: true }) disabled: boolean = false;

  /** Makes this static and not editable. */
  @Prop({ reflect: true }) static: boolean = false;

  /** Makes the checkbox a required field. */
  @Prop({ reflect: true }) required: boolean = false;

  /** Draws the checkbox in a checked state. */
  @Prop({ reflect: true, mutable: true }) checked: boolean = false;

  /** Draws the checkbox in an indeterminate state. */
  @Prop({ reflect: true, mutable: true }) indeterminate: boolean = false;

  /** This will be true when the control is in an invalid state. Validity is determined by the `required` prop. */
  @Prop({ reflect: true, mutable: true }) invalid: boolean = false;

  /** Emitted when the control loses focus. */
  @Event() scBlur: EventEmitter<void>;

  /** Emitted when the control's checked state changes. */
  @Event() scChange: EventEmitter<void>;

  /** Emitted when the control gains focus. */
  @Event() scFocus: EventEmitter<void>;

  firstUpdated() {
    this.input.indeterminate = this.indeterminate;
  }

  /** Simulates a click on the checkbox. */
  @Method()
  async triggerClick() {
    return this.input.click();
  }

  /** Sets focus on the checkbox. */
  @Method()
  async triggerFocus(options?: FocusOptions) {
    return this.input.focus(options);
  }

  /** Removes focus from the checkbox. */
  @Method()
  async triggerBlur() {
    return this.input.blur();
  }

  /** Checks for validity and shows the browser's validation message if the control is invalid. */
  @Method()
  async reportValidity() {
    this.invalid = !this.input.checkValidity();
    return this.input.reportValidity();
  }

  /** Sets a custom validation message. If `message` is not empty, the field will be considered invalid. */
  setCustomValidity(message: string) {
    this.input.setCustomValidity(message);
    this.invalid = !this.input.checkValidity();
  }

  handleClick() {
    this.checked = !this.checked;
    this.indeterminate = false;
  }

  handleBlur() {
    this.hasFocus = false;
    this.scBlur.emit();
  }

  handleFocus() {
    this.hasFocus = true;
    this.scFocus.emit();
  }

  handleLabelMouseDown() {
    // Prevent clicks on the label from briefly blurring the input
    // event.preventDefault();
    this.input.focus();
  }

  @Watch('checked')
  @Watch('indeterminate')
  handleStateChange() {
    this.input.checked = this.checked;
    this.input.indeterminate = this.indeterminate;
    this.scChange.emit();
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
    const Tag = this.static ? 'div' : 'label';
    return (
      <Tag
        part="base"
        class={{
          'checkbox': true,
          'checkbox--is-required': this.required,
          'checkbox--checked': this.checked,
          'checkbox--disabled': this.disabled,
          'checkbox--focused': this.hasFocus,
          'checkbox--indeterminate': this.indeterminate,
        }}
        htmlFor={this.inputId}
        onMouseDown={() => this.handleLabelMouseDown()}
      >
        <span part="control" class="checkbox__control">
          {this.checked ? (
            <span part="checked-icon" class="checkbox__icon">
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
            </span>
          ) : (
            ''
          )}
          {!this.checked && this.indeterminate ? (
            <span part="indeterminate-icon" class="checkbox__icon">
              <svg viewBox="0 0 16 16">
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
                  <g stroke="currentColor" stroke-width="2">
                    <g transform="translate(2.285714, 6.857143)">
                      <path d="M10.2857143,1.14285714 L1.14285714,1.14285714"></path>
                    </g>
                  </g>
                </g>
              </svg>
            </span>
          ) : (
            ''
          )}
          <input
            id={this.inputId}
            ref={el => (this.input = el as HTMLInputElement)}
            type="checkbox"
            name={this.name}
            value={this.value}
            checked={this.checked}
            disabled={this.disabled}
            required={this.required}
            role="checkbox"
            aria-checked={this.checked ? 'true' : 'false'}
            aria-labelledby={this.labelId}
            onClick={() => this.handleClick()}
            onBlur={() => this.handleBlur()}
            onFocus={() => this.handleFocus()}
          />
        </span>
        <span part="label" id={this.labelId} class="checkbox__label">
          <slot></slot>
        </span>
      </Tag>
    );
  }
}
