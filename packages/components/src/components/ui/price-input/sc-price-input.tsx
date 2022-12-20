import { Component, Prop, Event, EventEmitter, h, Method, Watch, Element } from '@stencil/core';
import { getCurrencySymbol } from '../../../functions/price';
import { FormSubmitController } from '../../../functions/form-data';
import { isZeroDecimal, maybeConvertAmount } from '../../util/format-number/functions/utils';

/**
 * @part base - The elements base wrapper.
 * @part input - The html input element.
 * @part base - The elements base wrapper.
 * @part prefix - Used to prepend an icon or element to the input.
 * @part suffix - Used to prepend an icon or element to the input.
 * @part help-text - Help text that describes how to use the input.
 */
@Component({
  tag: 'sc-price-input',
  styleUrl: 'sc-price-input.css',
  shadow: true,
})
export class ScPriceInput {
  @Element() el: HTMLScPriceInputElement;
  private scInput: HTMLScInputElement;

  private formController: any;

  /** The input's size. */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** The input's name attribute. */
  @Prop() name: string;

  /** The input's value attribute. */
  @Prop({ mutable: true }) value = '';

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

  /** The input's placeholder text. */
  @Prop() placeholder: string;

  /** Disables the input. */
  @Prop({ reflect: true }) disabled: boolean = false;

  /** Makes the input readonly. */
  @Prop({ reflect: true }) readonly: boolean = false;

  /** The minimum length of input that will be considered valid. */
  @Prop() minlength: number;

  /** The maximum length of input that will be considered valid. */
  @Prop() maxlength: number;

  /** The input's maximum value. */
  @Prop({ reflect: true }) max: number;

  /** The input's minimum value. */
  @Prop({ reflect: true }) min: number;

  /** Makes the input a required field. */
  @Prop({ reflect: true }) required = false;

  /**
   * This will be true when the control is in an invalid state. Validity is determined by props such as `type`,
   * `required`, `minlength`, `maxlength`, and `pattern` using the browser's constraint validation API.
   */
  @Prop({ mutable: true, reflect: true }) invalid = false;

  /** The input's autofocus attribute. */
  @Prop() autofocus: boolean;

  /** Inputs focus */
  @Prop({ mutable: true, reflect: true }) hasFocus: boolean;

  /** 3 letter currency code for input */
  @Prop({ reflect: true }) currencyCode: string;

  /** Show the currency code with the input */
  @Prop() showCode: boolean;

  /** Emitted when the control's value changes. */
  @Event({ composed: true })
  scChange: EventEmitter<void>;

  @Method()
  async reportValidity() {
    return this.scInput.shadowRoot.querySelector('input').reportValidity();
  }

  /** Sets focus on the input. */
  @Method()
  async triggerFocus(options?: FocusOptions) {
    return this.scInput.triggerFocus(options);
  }

  /** Sets a custom validation message. If `message` is not empty, the field will be considered invalid. */
  @Method()
  async setCustomValidity(message: string) {
    this.scInput.setCustomValidity(message);
  }

  /** Removes focus from the input. */
  @Method()
  async triggerBlur() {
    return this.scInput.blur();
  }

  @Watch('hasFocus')
  handleFocusChange() {
    this.hasFocus ? this.scInput?.focus?.() : this.scInput?.blur?.();
  }

  handleChange() {
    this.updateValue();
  }

  handleInput() {
    this.updateValue();
  }

  updateValue() {
    const val = isZeroDecimal(this.currencyCode) ? parseFloat(this.scInput.value) : (parseFloat(this.scInput.value) * 100).toFixed(2);
    this.value = this.scInput.value ? val.toString() : '';
  }

  componentDidLoad() {
    this.handleFocusChange();
    this.formController = new FormSubmitController(this.el).addFormData();
    document.addEventListener('wheel', () => {
      this.scInput.triggerBlur();
    });
  }

  disconnectedCallback() {
    this.formController?.removeFormData();
  }

  render() {
    return (
      <sc-input
        exportparts="base, input, form-control, label, help-text, prefix, suffix"
        size={this.size}
        label={this.label}
        showLabel={this.showLabel}
        help={this.help}
        ref={el => (this.scInput = el as HTMLScInputElement)}
        type="number"
        name={this.name}
        disabled={this.disabled}
        readonly={this.readonly}
        required={this.required}
        placeholder={this.placeholder}
        minlength={this.minlength}
        maxlength={this.maxlength}
        min={!!this.min ? this.min / 100 : 0.0}
        step={0.001}
        max={!!this.max ? this.max / 100 : null}
        // TODO: Test These below
        autofocus={this.autofocus}
        inputmode={'decimal'}
        onScChange={() => this.handleChange()}
        onScInput={() => this.handleInput()}
        value={maybeConvertAmount(parseFloat(this.value), this.currencyCode).toString()}
      >
        <span style={{ opacity: '0.5' }} slot="prefix">
          {getCurrencySymbol(this.currencyCode)}
        </span>

        <span slot="suffix">
          <slot name="suffix">{this.showCode && this?.currencyCode && <span style={{ opacity: '0.5' }}>{this.currencyCode.toUpperCase()}</span>}</slot>
        </span>
      </sc-input>
    );
  }
}
