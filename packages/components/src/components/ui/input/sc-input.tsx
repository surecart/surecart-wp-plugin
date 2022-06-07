import { Component, Prop, State, Watch, h, Event, EventEmitter, Method, Element, Host } from '@stencil/core';
import { FormSubmitController } from '../../../functions/form-data';

let id = 0;

/**
 * @part base - The elements base wrapper.
 * @part input - The html input element.
 * @part base - The elements base wrapper.
 * @part prefix - Used to prepend an icon or element to the input.
 * @part suffix - Used to prepend an icon or element to the input.
 * @part help-text - Help text that describes how to use the input.
 */
@Component({
  tag: 'sc-input',
  styleUrl: 'sc-input.scss',
  shadow: true,
})
export class ScInput {
  private input: HTMLInputElement;
  private inputId: string = `input-${++id}`;
  private helpId = `input-help-text-${id}`;
  private labelId = `input-label-${id}`;

  /** Element */
  @Element() el: HTMLScInputElement;

  private formController: any;

  @Prop() squared: boolean;
  @Prop() squaredBottom: boolean;
  @Prop() squaredTop: boolean;
  @Prop() squaredLeft: boolean;
  @Prop() squaredRight: boolean;

  /** Hidden */
  @Prop() hidden: boolean = false;

  /** The input's type. */
  @Prop({ reflect: true }) type: 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url' = 'text';

  /** The input's size. */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** The input's name attribute. */
  @Prop({ reflect: true }) name: string;

  /** The input's value attribute. */
  @Prop({ mutable: true, reflect: true }) value = '';

  /** Draws a pill-style input with rounded edges. */
  @Prop({ reflect: true }) pill = false;

  /** The input's label. */
  @Prop() label: string;

  /** Should we show the label */
  @Prop() showLabel: boolean = true;

  /** The input's help text. */
  @Prop() help: string = '';

  /** Adds a clear button when the input is populated. */
  @Prop() clearable = false;

  /** Adds a password toggle button to password inputs. */
  @Prop() togglePassword: boolean = false;

  /** The input's placeholder text. */
  @Prop() placeholder: string;

  /** Disables the input. */
  @Prop({ reflect: true, mutable: true }) disabled: boolean = false;

  /** Makes the input readonly. */
  @Prop({ reflect: true }) readonly: boolean = false;

  /** The minimum length of input that will be considered valid. */
  @Prop() minlength: number;

  /** The maximum length of input that will be considered valid. */
  @Prop() maxlength: number;

  /** The input's minimum value. */
  @Prop() min: number | string;

  /** The input's maximum value. */
  @Prop() max: number | string;

  /** The input's step attribute. */
  @Prop() step: number;

  /** A pattern to validate input against. */
  @Prop() pattern: string;

  /** Makes the input a required field. */
  @Prop({ reflect: true }) required = false;

  /**
   * This will be true when the control is in an invalid state. Validity is determined by props such as `type`,
   * `required`, `minlength`, `maxlength`, and `pattern` using the browser's constraint validation API.
   */
  @Prop({ mutable: true, reflect: true }) invalid = false;

  /** The input's autocorrect attribute. */
  @Prop() autocorrect: string;

  /** The input's autocomplete attribute. */
  @Prop() autocomplete: string;

  /** The input's autofocus attribute. */
  @Prop() autofocus: boolean;

  /** Enables spell checking on the input. */
  @Prop() spellcheck: boolean;

  /** The input's inputmode attribute. */
  @Prop() inputmode: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';

  /** Inputs focus */
  @Prop({ mutable: true, reflect: true }) hasFocus: boolean;

  /** Is the password visible */
  @State() isPasswordVisible = false;

  /** Emitted when the control's value changes. */
  @Event({ composed: true })
  scChange: EventEmitter<void>;

  /** Emitted when the clear button is activated. */
  @Event() scClear: EventEmitter<void>;

  /** Emitted when the control receives input. */
  @Event() scInput: EventEmitter<void>;

  /** Emitted when the control gains focus. */
  @Event() scFocus: EventEmitter<void>;

  /** Emitted when the control loses focus. */
  @Event() scBlur: EventEmitter<void>;

  @Method()
  async reportValidity() {
    return this.input.reportValidity();
  }

  /** Sets focus on the input. */
  @Method()
  async triggerFocus(options?: FocusOptions) {
    return this.input.focus(options);
  }

  /** Sets a custom validation message. If `message` is not empty, the field will be considered invalid. */
  @Method()
  async setCustomValidity(message: string) {
    this.input.setCustomValidity(message);
    this.invalid = !this.input.checkValidity();
  }

  /** Removes focus from the input. */
  @Method()
  async triggerBlur() {
    return this.input.blur();
  }

  /** Selects all the text in the input. */
  select() {
    return this.input.select();
  }

  handleBlur() {
    this.hasFocus = false;
    this.scBlur.emit();
  }

  handleFocus() {
    this.hasFocus = true;
    this.scFocus.emit();
  }

  handleChange() {
    this.value = this.input.value;
    this.scChange.emit();
  }

  handleInput() {
    this.value = this.input.value;
    this.scInput.emit();
  }

  handleClearClick(event: MouseEvent) {
    this.value = '';
    this.scClear.emit();
    this.scInput.emit();
    this.scChange.emit();
    this.input.focus();

    event.stopPropagation();
  }

  handlePasswordToggle() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  @Watch('hasFocus')
  handleFocusChange() {
    setTimeout(() => {
      this.hasFocus && this.input ? this.input.focus() : this.input.blur();
    }, 0);
  }

  @Watch('value')
  handleValueChange() {
    if (this.input) {
      this.invalid = !this.input.checkValidity();
    }
  }

  componentDidLoad() {
    this.formController = new FormSubmitController(this.el).addFormData();
    this.handleFocusChange();
  }

  disconnectedCallback() {
    this.formController?.removeFormData();
  }

  render() {
    return (
      <Host hidden={this.hidden}>
        <sc-form-control
          size={this.size}
          required={this.required}
          label={this.label}
          showLabel={this.showLabel}
          help={this.help}
          inputId={this.inputId}
          helpId={this.helpId}
          labelId={this.labelId}
          name={this.name}
        >
          <div
            part="base"
            class={{
              'input': true,

              // Sizes
              'input--small': this.size === 'small',
              'input--medium': this.size === 'medium',
              'input--large': this.size === 'large',

              // States
              'input--focused': this.hasFocus,
              'input--invalid': this.invalid,
              'input--disabled': this.disabled,

              'input--squared': this.squared,
              'input--squared-bottom': this.squaredBottom,
              'input--squared-top': this.squaredTop,
              'input--squared-left': this.squaredLeft,
              'input--squared-right': this.squaredRight,
            }}
          >
            <span part="prefix" class="input__prefix">
              <slot name="prefix"></slot>
            </span>

            <slot>
              <input
                part="input"
                id={this.inputId}
                class="input__control"
                ref={el => (this.input = el as HTMLInputElement)}
                type={this.type === 'password' && this.isPasswordVisible ? 'text' : this.type}
                name={this.name}
                disabled={this.disabled}
                readonly={this.readonly}
                required={this.required}
                placeholder={this.placeholder}
                minlength={this.minlength}
                maxlength={this.maxlength}
                min={this.min}
                max={this.max}
                step={this.step}
                // TODO: Test These below
                autocomplete={this.autocomplete}
                autocorrect={this.autocorrect}
                autofocus={this.autofocus}
                spellcheck={this.spellcheck}
                pattern={this.pattern}
                inputmode={this.inputmode}
                aria-labelledby={this.label}
                aria-invalid={this.invalid ? true : false}
                value={this.value}
                onChange={() => this.handleChange()}
                onInput={() => this.handleInput()}
                // onInvalid={this.handleInvalid}
                onFocus={() => this.handleFocus()}
                onBlur={() => this.handleBlur()}
              />
            </slot>

            <span part="suffix" class="input__suffix">
              <slot name="suffix"></slot>
            </span>

            {this.clearable && this.value?.length > 0 && (
              <button part="clear-button" class="input__clear" type="button" onClick={e => this.handleClearClick(e)} tabindex="-1">
                <slot name="clear-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="feather feather-x"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </slot>
              </button>
            )}
          </div>
        </sc-form-control>
      </Host>
    );
  }
}
