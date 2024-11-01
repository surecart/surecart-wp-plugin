import { Customer, Checkout } from '../../../../types';
import { Component, Prop, h, Event, EventEmitter, Method } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { state as userState } from '@store/user';
import { state as checkoutState, onChange } from '@store/checkout';
import { getValueFromUrl } from '../../../../functions/util';
import { createOrUpdateCheckout } from '../../../../services/session';

@Component({
  tag: 'sc-customer-lastname',
  styleUrl: 'sc-customer-lastname.css',
  shadow: true,
})
export class ScCustomerLastname {
  private input: HTMLScInputElement;

  private removeCheckoutListener: () => void;

  /** Is the user logged in. */
  @Prop() loggedIn: boolean;

  /** The input's size. */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** The input's value attribute. */
  @Prop({ mutable: true }) value = null;

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

  /** Emitted when the control receives input. */
  @Event() scInput: EventEmitter<void>;

  /** Emitted when the control gains focus. */
  @Event() scFocus: EventEmitter<void>;

  /** Emitted when the control loses focus. */
  @Event() scBlur: EventEmitter<void>;

  /** Don't allow a blank space as an input here. */
  @Method()
  async reportValidity() {
    return this.input.reportValidity();
  }

  /** Silently update the checkout when the input changes. */
  async handleChange() {
    this.value = this.input.value;
    try {
      checkoutState.checkout = (await createOrUpdateCheckout({ id: checkoutState.checkout.id, data: { last_name: this.input.value } })) as Checkout;
    } catch (error) {
      console.error(error);
    }
  }

  /** Sync customer last name with session if it's updated by other means */
  handleSessionChange() {
    // we already have a value.
    if (this.value) return;

    const fromUrl = getValueFromUrl('last_name');
    if (!userState.loggedIn && !!fromUrl) {
      this.value = fromUrl;
      return;
    }

    if (userState.loggedIn) {
      this.value = (checkoutState?.checkout?.customer as Customer)?.last_name || checkoutState?.checkout?.last_name;
    } else {
      this.value = checkoutState?.checkout?.last_name || (checkoutState?.checkout?.customer as Customer)?.last_name;
    }
  }

  /** Listen to checkout. */
  componentWillLoad() {
    this.handleSessionChange();
    this.removeCheckoutListener = onChange('checkout', () => this.handleSessionChange());
  }

  /** Remove listener. */
  disconnectedCallback() {
    this.removeCheckoutListener();
  }

  render() {
    return (
      <sc-input
        type="text"
        name="last_name"
        ref={el => (this.input = el as HTMLScInputElement)}
        value={this.value}
        label={this.label}
        help={this.help}
        autocomplete="last_name"
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
        {...(this.disabled && { disabled: true })}
      ></sc-input>
    );
  }
}
