import { Component, Event, EventEmitter, h, Method, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { state as checkoutState, onChange } from '@store/checkout';

import { Checkout, Customer } from '../../../../types';

@Component({
  tag: 'sc-customer-phone',
  styleUrl: 'sc-customer-phone.css',
  shadow: true,
})
export class ScCustomerPhone {
  private input: HTMLScInputElement;

  /** Is the user logged in. */
  @Prop() loggedIn: boolean;

  /** (passed from the sc-checkout component automatically) */
  @Prop() checkout: Checkout;

  /** Force a customer. */
  @Prop() customer: Customer;

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

  /** Error focus */
  @Prop({ mutable: true }) error: boolean;

  /** Emitted when the control's value changes. */
  @Event({ composed: true }) scChange: EventEmitter<void>;

  @Event() scUpdateOrderState: EventEmitter<Partial<Checkout>>;

  /** Emitted when the clear button is activated. */
  @Event() scClear: EventEmitter<void>;

  /** Emitted when the control receives input. */
  @Event() scInput: EventEmitter<void>;

  /** Emitted when the control gains focus. */
  @Event() scFocus: EventEmitter<void>;

  /** Emitted when the control loses focus. */
  @Event() scBlur: EventEmitter<void>;

  @Event() scUpdateCustomer: EventEmitter<{ email: string }>;

  async handleChange() {
    this.value = this.input.value;
    this.scChange.emit();
  }

  @Method()
  async reportValidity() {
    return this.input?.reportValidity?.();
  }

  componentWillLoad() {
    this.handleCheckoutChange();
    onChange('checkout', () => this.handleCheckoutChange());
  }

  handleCheckoutChange() {
    // we only want to do this  if we don't have a value.
    if (this.value) return;

    // if the checkout has a phone, use that.
    if (checkoutState.checkout?.phone) {
      this.value = checkoutState.checkout?.phone;
      return;
    }

    // if the customer has a phone, use that.
    if ((checkoutState.checkout?.customer as Customer)?.phone) {
      this.value = (checkoutState.checkout?.customer as Customer)?.phone;
      return;
    }
  }

  render() {
    return (
      <sc-phone-input
        name="phone"
        ref={el => (this.input = el as HTMLScInputElement)}
        value={this.value}
        disabled={!!this.loggedIn}
        label={this.label}
        help={this.help}
        autocomplete="phone"
        placeholder={this.placeholder}
        readonly={this.readonly}
        required={this.required}
        invalid={this.invalid}
        autofocus={this.autofocus}
        hasFocus={this.hasFocus}
        onScChange={() => this.handleChange()}
        onScInput={() => this.scInput.emit()}
        onScFocus={() => this.scFocus.emit()}
        onScBlur={() => this.scBlur.emit()}
      ></sc-phone-input>
    );
  }
}
