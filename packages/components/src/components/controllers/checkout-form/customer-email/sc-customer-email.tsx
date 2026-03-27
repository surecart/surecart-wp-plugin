import { Component, Event, EventEmitter, Fragment, h, Method, Prop, State, Watch } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { speak } from '@wordpress/a11y';
import apiFetch from '@wordpress/api-fetch';

import { createOrUpdateCheckout } from '../../../../services/session';
import { Checkout, Customer } from '../../../../types';
import { getValueFromUrl } from '../../../../functions/util';
import { state as userState, onChange as onChangeUser } from '@store/user';
import { state as checkoutState, onChange } from '@store/checkout';
import { MATCHED, UNVERIFIED, VERIFYING } from '@store/user/constants';

@Component({
  tag: 'sc-customer-email',
  styleUrl: 'sc-customer-email.scss',
  shadow: true,
})
export class ScCustomerEmail {
  private input: HTMLScInputElement;

  private removeCheckoutListener: () => void;
  private removeUserListener: () => void;

  /** A message for tracking confirmation. */
  @Prop() trackingConfirmationMessage: string;

  /** The input's size. */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** The input's value attribute. */
  @Prop({ mutable: true }) value = getValueFromUrl('email');

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

  /** Is busy or not eg: email checking */
  @State() busy: boolean;

  /** Error */
  @State() error: string = '';

  /** Emitted when the control's value changes. */
  @Event({ composed: true }) scChange: EventEmitter<void>;

  /** Emitted when the clear button is activated. */
  @Event() scClear: EventEmitter<void>;

  /** Emitted when the control receives input. */
  @Event() scInput: EventEmitter<void>;

  /** Emitted when the control gains focus. */
  @Event() scFocus: EventEmitter<void>;

  /** Emitted when the control loses focus. */
  @Event() scBlur: EventEmitter<void>;

  /** Update the order state. */
  @Event() scUpdateOrderState: EventEmitter<Checkout>;

  /** Update the abandoned cart. */
  @Event() scUpdateAbandonedCart: EventEmitter<boolean>;

  /** Prompt for login. */
  @Event() scLoginPrompt: EventEmitter<void>;

  async handleChange() {
    this.value = this.input.value;
    this.scChange.emit();

    try {
      checkoutState.checkout = (await createOrUpdateCheckout({ id: checkoutState.checkout.id, data: { email: this.input.value } })) as Checkout;
    } catch (error) {
      console.log(error);
    } finally {
      this.busy = false;
    }
  }

  @Watch('value')
  async createLoginCode() {
    if (!this.value) return;
    if (userState.loggedIn) return;

    // Check if a valid email using regex, if not return.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value)) {
      return;
    }

    try {
      this.busy = true;
      await apiFetch({
        method: 'POST',
        path: 'surecart/v1/verification_codes',
        data: {
          login: this.value,
          checkout_mode: checkoutState.mode,
        },
      });
      userState.email = this.value;
      userState.verificationStatus = MATCHED;

      speak(__('Verification code is sent to your email. Please check your email.', 'surecart'), 'assertive');
    } catch (e) {
      this.handleCodeSendError(e);
    } finally {
      this.busy = false;
    }
  }

  @Method()
  async reportValidity() {
    // if user is logged in, no need to validate.
    if (userState.loggedIn) return true;

    return this.input?.reportValidity?.();
  }

  /** Sync customer email with session if it's updated by other means */
  handleSessionChange() {
    // we already have a value and we are not yet logged in.
    if (this.value && !userState.loggedIn) return;

    // we are logged in already.
    if (userState.loggedIn) {
      // get email from user state fist.
      this.value = userState.email || (checkoutState?.checkout?.customer as Customer)?.email || checkoutState?.checkout?.email;
      return;
    }

    const fromUrl = getValueFromUrl('email');
    if (!userState.loggedIn && !!fromUrl) {
      this.value = fromUrl;
      return;
    }

    this.value = checkoutState?.checkout?.email || (checkoutState?.checkout?.customer as Customer)?.email;

    if (!!this.value && !userState.loggedIn) {
      userState.email = this.value;
    }
  }

  /** Listen to checkout. */
  componentWillLoad() {
    this.handleSessionChange();
    this.removeCheckoutListener = onChange('checkout', () => this.handleSessionChange());
    this.removeUserListener = onChangeUser('email', val => {
      this.value = val;
    });
  }

  handleCodeSendError(error: any) {
    (error?.additional_errors || []).forEach((e: any) => {
      if (e?.code === 'verification_code.email.blocked_duplicate') {
        userState.email = this.input?.value || '';
        userState.verificationStatus = MATCHED;
      }

      this.error = e?.message || __('Verification code is not valid. Please try again.', 'surecart');
    });
  }

  /** Remove listener. */
  disconnectedCallback() {
    this.removeCheckoutListener();
    this.removeUserListener();
  }

  renderOptIn() {
    if (!this.trackingConfirmationMessage) return null;

    if (checkoutState.abandonedCheckoutEnabled !== false) {
      return (
        <div class="tracking-confirmation-message">
          <span>{this.trackingConfirmationMessage}</span>{' '}
          <a
            href="#"
            onClick={e => {
              e.preventDefault();
              this.scUpdateAbandonedCart.emit(false);
            }}
          >
            {__('No Thanks', 'surecart')}
          </a>
        </div>
      );
    }

    return (
      <div class="tracking-confirmation-message">
        <span> {__("You won't receive further emails from us.", 'surecart')}</span>
      </div>
    );
  }

  render() {
    if (userState.loggedIn) {
      return <sc-customer-email-preview></sc-customer-email-preview>;
    }

    if (userState.verificationStatus === MATCHED || userState.verificationStatus === VERIFYING || userState.verificationStatus === UNVERIFIED) {
      return <sc-customer-login codeError={this.error}></sc-customer-login>;
    }

    return (
      <Fragment>
        <sc-input
          exportparts="base, input, form-control, label, help-text, prefix, suffix"
          type="email"
          name="email"
          ref={el => (this.input = el as HTMLScInputElement)}
          value={this.value}
          help={this.help}
          label={this.label}
          autocomplete={'email'}
          placeholder={this.placeholder}
          disabled={this.disabled || (!!userState.loggedIn && !!this.value?.length && !this.invalid)}
          readonly={this.readonly}
          required={true}
          invalid={this.invalid}
          autofocus={this.autofocus}
          hasFocus={this.hasFocus}
          onScChange={() => this.handleChange()}
          onScInput={() => {
            this.scInput.emit();
            this.createLoginCode();
          }}
          onScFocus={() => this.scFocus.emit()}
          onScBlur={() => this.scBlur.emit()}
        >
          {this.busy && <sc-spinner slot="suffix" class="account-loader" />}
        </sc-input>

        {this.renderOptIn()}
      </Fragment>
    );
  }
}
