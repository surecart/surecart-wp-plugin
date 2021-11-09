import { Component, Prop, Event, EventEmitter, h, Method, Watch, Element } from '@stencil/core';
import { getCurrencySymbol } from '../../../functions/price';

/**
 * @part base - The elements base wrapper.
 * @part input - The html input element.
 * @part base - The elements base wrapper.
 * @part prefix - Used to prepend an icon or element to the input.
 * @part suffix - Used to prepend an icon or element to the input.
 * @part help-text - Help text that describes how to use the input.
 */
@Component({
  tag: 'ce-price-input',
  styleUrl: 'ce-price-input.css',
  shadow: true,
})
export class CePriceInput {
  @Element() el: HTMLCePriceInputElement;
  private ceInput: HTMLCeInputElement;

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
  @Prop() max: number | string;

  /** The input's minimum value. */
  @Prop() min: number | string;

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
  @Prop() currencyCode: string;

  /** Emitted when the control's value changes. */
  @Event({ composed: true })
  ceChange: EventEmitter<void>;

  @Method('reportValidity')
  async reportValidity() {
    return this.ceInput.reportValidity();
  }

  /** Sets focus on the input. */
  @Method()
  async triggerFocus(options?: FocusOptions) {
    return this.ceInput.triggerFocus(options);
  }

  /** Sets a custom validation message. If `message` is not empty, the field will be considered invalid. */
  @Method()
  async setCustomValidity(message: string) {
    this.ceInput.setCustomValidity(message);
  }

  /** Removes focus from the input. */
  @Method()
  async triggerBlur() {
    return this.ceInput.blur();
  }

  @Watch('hasFocus')
  handleFocusChange() {
    this.hasFocus ? this.ceInput.focus() : this.ceInput.blur();
  }

  handleChange() {
    this.value = (parseFloat(this.ceInput.value) * 100).toString();
  }

  render() {
    return (
      <div>
        <ce-input
          size={this.size}
          label={this.label}
          showLabel={this.showLabel}
          help={this.help}
          ref={el => (this.ceInput = el as HTMLCeInputElement)}
          type="number"
          name={this.name}
          disabled={this.disabled}
          readonly={this.readonly}
          required={this.required}
          placeholder={this.placeholder}
          minlength={this.minlength}
          maxlength={this.maxlength}
          min={this.min || 0.0}
          step={0.001}
          max={this.max}
          // TODO: Test These below
          autofocus={this.autofocus}
          inputmode={'decimal'}
          onCeChange={() => this.handleChange()}
          value={(parseFloat(this.value) / 100).toString()}
        >
          <span style={{ opacity: '0.5' }} slot="prefix">
            {getCurrencySymbol(this.currencyCode)}
          </span>
        </ce-input>
      </div>
    );
  }
}
