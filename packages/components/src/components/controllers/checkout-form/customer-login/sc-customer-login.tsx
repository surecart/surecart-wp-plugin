/**
 * External dependencies.
 */
import { Component, h, Prop, State, Host } from '@stencil/core';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import { speak } from '@wordpress/a11y';

/**
 * Internal dependencies.
 */
import { state as userState, resetUser, VERIFYING, VERIFIED, UNVERIFIED } from '@store/user';
import { createOrUpdateCheckout } from '@services/session';
import { state as checkoutState } from '@store/checkout';
import { Checkout } from 'src/types';

@Component({
  tag: 'sc-customer-login',
  styleUrl: 'sc-customer-login.scss',
  shadow: true,
})
export class ScCustomerLogin {
  /** The mode of the login */
  @State() mode: 'code' | 'password' = 'code';

  /** Is the component busy */
  @State() busy: boolean = false;

  /** Is code resending */
  @State() codeResending: boolean = false;

  /** Code sent label */
  @State() codeSentLabel: string = '';

  /** Code sent icon */
  @State() codeSentIcon: string = '';

  /** Seconds remaining in the resend cooldown */
  @State() resendCooldown: number = 60;

  /** Interval timer reference for cleanup */
  private cooldownInterval: any = null;

  /** Verified */
  @State() verified: boolean = false;

  /** Error */
  @State() error: string = '';

  /** Code Error coming from the parent */
  @Prop() codeError: string = '';

  /** Login Password */
  @State() password: string = '';

  async verifyCode(code: string) {
    // If not valid email and code, then return.
    if (!userState.email || !code) {
      return;
    }

    try {
      this.error = '';
      userState.verificationStatus = VERIFYING;
      this.busy = true;
      speak(__('Verifying code...', 'surecart'), 'assertive');

      const user = (await apiFetch({
        method: 'POST',
        path: 'surecart/v1/verification_codes/verify',
        data: {
          login: userState.email,
          code: code,
          checkout_mode: checkoutState.mode,
        },
      })) as any;
      userState.verificationStatus = VERIFIED;

      if (!user?.verified) {
        throw { message: __('Verification code is not valid. Please try again.', 'surecart') };
      }

      // Update the nonce after login to prevent rest_cookie_invalid_nonce errors.
      // @ts-ignore - nonceMiddleware is set in fetch.ts but not in @wordpress/api-fetch types.
      if (user?.nonce && apiFetch.nonceMiddleware) {
        // @ts-ignore
        apiFetch.nonceMiddleware.nonce = user.nonce;
      }

      // Update userState and make the user as logged in user.
      userState.loggedIn = true;
      userState.name = user?.name || [user?.customer?.first_name, user?.customer?.last_name].filter(Boolean).join(' ') || 'N/A';

      speak(__('Verification is successful. Please continue your purchase.', 'surecart'), 'assertive');

      // Update checkout with the shipping address.
      await this.updateCheckout({
        shipping_address: user?.customer?.shipping_address,
        first_name: user?.customer?.first_name,
        last_name: user?.customer?.last_name,
        phone: user?.customer?.phone,
      });
    } catch (e) {
      if (e.code === 'not_found') {
        this.error = __('Verification code is not valid. Please try again.', 'surecart');
      } else {
        this.error = e?.message || __('Verification code is not valid. Please try again.', 'surecart');
      }

      userState.verificationStatus = UNVERIFIED;
    }
  }

  async updateCheckout(data: any) {
    try {
      checkoutState.checkout = (await createOrUpdateCheckout({
        id: checkoutState.checkout.id,
        data,
      })) as Checkout;
    } catch (error) {
      this.error = error?.message || __('Failed to update checkout. Please try again.', 'surecart');
    } finally {
      this.busy = false;
    }
  }

  async resendCode() {
    try {
      this.error = '';
      this.codeResending = true;
      speak(__('Sending code...', 'surecart'), 'assertive');
      await apiFetch({
        method: 'POST',
        path: 'surecart/v1/verification_codes',
        data: {
          login: userState.email,
        },
      });

      this.codeSentLabel = __('Code sent', 'surecart');
      speak(this.codeSentLabel, 'assertive');
      this.codeSentIcon = 'check';

      setTimeout(() => {
        this.codeSentLabel = '';
        this.codeSentIcon = '';
      }, 3000);

      this.startCooldown();
    } catch (e) {
      console.error(e);
      this.handleCodeSendError(e);
    } finally {
      this.codeResending = false;
    }
  }

  handleCodeSendError(error: any) {
    (error?.additional_errors || []).forEach((e: any) => {
      if (e?.code === 'verification_code.email.blocked_duplicate') {
        this.error = e?.message || __('A code was just sent to you, please wait a minute before resending.', 'surecart');
        this.startCooldown();
      }
    });
  }

  startCooldown() {
    clearInterval(this.cooldownInterval);
    this.resendCooldown = 60;

    this.cooldownInterval = setInterval(() => {
      this.resendCooldown--;

      if (this.resendCooldown <= 0) {
        clearInterval(this.cooldownInterval);
        this.cooldownInterval = null;
        speak(__('You can resend the code now.', 'surecart'), 'assertive');
      }
    }, 1000);
  }

  componentWillLoad() {
    this.startCooldown();
  }

  disconnectedCallback() {
    clearInterval(this.cooldownInterval);
  }

  async loginByPassword(e: any) {
    e.preventDefault();

    try {
      this.error = '';
      this.busy = true;
      const { name, email, nonce } = (await apiFetch({
        method: 'POST',
        path: 'surecart/v1/login',
        data: {
          login: userState.email,
          password: this.password,
        },
      })) as any;

      // Update the nonce after login to prevent rest_cookie_invalid_nonce errors.
      // @ts-ignore - nonceMiddleware is set in fetch.ts but not in @wordpress/api-fetch types.
      if (nonce && apiFetch.nonceMiddleware) {
        // @ts-ignore
        apiFetch.nonceMiddleware.nonce = nonce;
      }

      this.verified = true;

      userState.loggedIn = true;
      userState.verificationStatus = VERIFIED;
      userState.name = name;
      userState.email = email;
    } catch (e) {
      this.error = e?.message || __('Login failed. Please try again.', 'surecart');
    } finally {
      this.busy = false;
    }
  }

  renderPasswordView() {
    return (
      <div class="customer-password">
        <sc-flex alignItems="center">
          <sc-input
            type="password"
            style={{ flex: '1' }}
            placeholder={__('Password', 'surecart')}
            required
            disabled={this.busy}
            onScInput={(e: any) => (this.password = e.target.value)}
            onKeyDown={(e: any) => {
              if (e.key === 'Enter') {
                this.loginByPassword(e);
              }
            }}
          />
          <sc-button size="medium" type="primary" loading={this.busy} onClick={(e: any) => this.loginByPassword(e)}>
            <sc-icon slot="prefix" name="lock" />
            &nbsp;
            {__('Login', 'surecart')}
          </sc-button>
        </sc-flex>
        {!!this.error && <p class="login-error">{this.error}</p>}
      </div>
    );
  }

  renderCodeView() {
    return (
      <div class="customer-code">
        <p class="customer-code__hint">
          {__('Enter the code sent to', 'surecart')} <span class="customer-code__preview">{userState.email}</span> {__('to securely use your saved information.', 'surecart')}
        </p>
        <div>
          <div class="customer-code__reset">
            <sc-verification-code total={6} loading={this.busy} onChange={value => this.verifyCode(value)} />
          </div>
          {(!!this.error || !!this.codeError) && <p class="login-error">{this.error || this.codeError}</p>}
        </div>

        <div class="customer-code__resend">
          <sc-button type="link" onClick={() => this.resendCode()} disabled={this.codeResending || this.resendCooldown > 0} loading={this.codeResending}>
            {!!this.codeSentIcon ? (
              <span style={{ color: 'var(--sc-color-success-900)' }}>
                <sc-icon name={this.codeSentIcon} aria-hidden="true" />
              </span>
            ) : this.resendCooldown > 0 ? (
              <span>
                {__('Resend in', 'surecart')} {this.resendCooldown}
                {__('s', 'surecart')}
              </span>
            ) : (
              <span>{__('Resend Code', 'surecart')}</span>
            )}
          </sc-button>
        </div>
      </div>
    );
  }

  render() {
    return (
      <Host>
        <div class="customer-login">
          <div class="customer-login__email">
            <div class="customer-login__email-text">
              <div class="customer-login__email-label">{__('Email', 'surecart')}</div>
              <div class="customer-login__email-value">{userState.email}</div>
            </div>
            <div class="customer-login__back">
              <sc-button type="text" size="small" onClick={() => resetUser()}>
                <sc-icon name="x" class="customer-login__back-icon" aria-label={__('Reset User', 'surecart')} />
              </sc-button>
            </div>
          </div>

          {this.mode === 'code' ? this.renderCodeView() : this.renderPasswordView()}
        </div>

        <div class="customer-login__mode">
          {this.mode === 'code' ? (
            <sc-button type="text" size="small" onClick={() => (this.mode = 'password')}>
              <sc-icon name="lock" slot="prefix" aria-hidden="true" />
              {__('Use Password', 'surecart')}
            </sc-button>
          ) : (
            <sc-button type="text" size="small" onClick={() => (this.mode = 'code')}>
              <sc-icon name="key" slot="prefix" aria-hidden="true" />
              {__('Use Login Code', 'surecart')}
            </sc-button>
          )}
        </div>
      </Host>
    );
  }
}
