import { Component, Prop, h, Event, EventEmitter, Watch } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';
import { CheckoutSession } from '../../../types';

@Component({
  tag: 'ce-email',
  shadow: false,
})
export class CeEmail {
  private input: HTMLCeInputElement;

  /** (passed from the ce-checkout component automatically) */
  @Prop() checkoutSession: CheckoutSession;

  /** The input's size. */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

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

  /** The input's placeholder text. */
  @Prop() placeholder: string;

  /** Disables the input. */
  @Prop({ reflect: true }) disabled: boolean = false;

  /** Makes the input readonly. */
  @Prop({ reflect: true }) readonly: boolean = false;

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

  /** Emitted when the control's value changes. */
  @Event({ composed: true }) ceChange: EventEmitter<void>;

  /** Emitted when the clear button is activated. */
  @Event() ceClear: EventEmitter<void>;

  /** Emitted when the control receives input. */
  @Event() ceInput: EventEmitter<void>;

  /** Emitted when the control gains focus. */
  @Event() ceFocus: EventEmitter<void>;

  /** Emitted when the control loses focus. */
  @Event() ceBlur: EventEmitter<void>;

  @Event() ceUpdateCustomer: EventEmitter<{ email: string }>;

  handleBlur() {
    if (this.checkoutSession.email !== this.value) {
      this.ceUpdateCustomer.emit({ email: this.value });
    }
    this.ceBlur.emit();
  }

  handleChange() {
    this.value = this.input.value;
    this.ceChange.emit();
  }

  /** Sync customer email with session if it's updated by other means */
  @Watch('checkoutSession')
  handleSessionChange(val) {
    if (val.customer_email) {
      if (val.customer_email !== this.value) {
        this.value = val.customer_email;
      }
    }
  }

  render() {
    return (
      <ce-input
        type="email"
        name="customer_email"
        ref={el => (this.input = el as HTMLCeInputElement)}
        value={this.value}
        label={this.label}
        help={this.help}
        autocomplete={'email'}
        placeholder={this.placeholder}
        disabled={this.disabled}
        readonly={this.readonly}
        required={this.required}
        invalid={this.invalid}
        autofocus={this.autofocus}
        hasFocus={this.hasFocus}
        onCeChange={() => this.handleChange()}
        onCeInput={() => this.ceInput.emit()}
        onCeFocus={() => this.ceFocus.emit()}
        onCeBlur={() => this.handleBlur()}
      ></ce-input>
    );
  }
}

openWormhole(CeEmail, ['checkoutSession'], false);
