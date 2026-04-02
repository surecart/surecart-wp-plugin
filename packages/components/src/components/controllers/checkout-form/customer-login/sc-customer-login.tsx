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
import { state as userState, resetUser, VERIFYING, VERIFIED, UNVERIFIED, CODE_EXPIRED } from '@store/user';
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

  formatCooldown(): string {
    const minutes = Math.floor(this.resendCooldown / 60);
    const seconds = this.resendCooldown % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

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
    } catch (e: any) {
      // If cooldown has elapsed, treat as expired code.
      if (this.resendCooldown <= 0) {
        userState.verificationStatus = CODE_EXPIRED;
        this.error = '';
        speak(__('Code expired. Please send a new code.', 'surecart'), 'assertive');
      } else {
        if (e.code === 'not_found') {
          this.error = __('Incorrect code. Please try again.', 'surecart');
        } else {
          this.error = e?.message || __('Incorrect code. Please try again.', 'surecart');
        }
        userState.verificationStatus = UNVERIFIED;
        speak(this.error, 'assertive');
      }
    } finally {
      this.busy = false;
    }
  }

  async updateCheckout(data: any) {
    try {
      checkoutState.checkout = (await createOrUpdateCheckout({
        id: checkoutState.checkout.id,
        data,
      })) as Checkout;
    } catch (error) {
      this.error = (error as any)?.message || __('Failed to update checkout. Please try again.', 'surecart');
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
          checkout_mode: checkoutState.mode,
        },
      });

      speak(__('Code sent', 'surecart'), 'assertive');
      userState.verificationStatus = UNVERIFIED;
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
    } catch (e: any) {
      this.error = e?.message || __('Login failed. Please try again.', 'surecart');
    } finally {
      this.busy = false;
    }
  }

  renderSentInfo() {
    return (
      <div class="customer-code__sent-info">
        <sc-icon name="mail" class="customer-code__mail-icon" aria-hidden="true" />
        <span>
          {__('Code sent to', 'surecart')} <strong class="customer-code__sent-email">{userState.email}</strong>
        </span>
        <a
          href="#"
          class="customer-code__change-link"
          onClick={e => {
            e.preventDefault();
            resetUser();
          }}
        >
          {__('Change', 'surecart')}
        </a>
      </div>
    );
  }

  renderCodeFooter() {
    const isExpired = userState.verificationStatus === CODE_EXPIRED;

    return (
      <div class="customer-code__footer">
        <div class="customer-code__footer-left">
          {!isExpired && this.resendCooldown > 0 && (
            <span class="customer-code__resend-timer">
              {__('Resend code in', 'surecart')} {this.formatCooldown()}
            </span>
          )}
          {!isExpired && this.resendCooldown <= 0 && (
            <a
              href="#"
              class="customer-code__resend-link"
              onClick={e => {
                e.preventDefault();
                this.resendCode();
              }}
            >
              {this.codeResending ? __('Sending...', 'surecart') : __('Resend Code', 'surecart')}
            </a>
          )}
        </div>
        <div class="customer-code__footer-right">
          <a
            href="#"
            class="customer-code__mode-link"
            onClick={e => {
              e.preventDefault();
              this.mode = 'password';
            }}
          >
            <sc-icon name="lock" aria-hidden="true" />
            {__('Use Password', 'surecart')}
          </a>
        </div>
      </div>
    );
  }

  renderPasswordView() {
    return (
      <div class="customer-password">
        {this.renderSentInfo()}
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
        {!!this.error && <p class="customer-password__error" role="alert" innerHTML={this.error}></p>}
        <div class="customer-code__footer">
          <div class="customer-code__footer-left"></div>
          <div class="customer-code__footer-right">
            <a
              href="#"
              class="customer-code__mode-link"
              onClick={e => {
                e.preventDefault();
                this.mode = 'code';
              }}
            >
              <sc-icon name="key" aria-hidden="true" />
              {__('Use Login Code', 'surecart')}
            </a>
          </div>
        </div>
      </div>
    );
  }

  renderCodeView() {
    const isExpired = userState.verificationStatus === CODE_EXPIRED;
    const isVerifying = userState.verificationStatus === VERIFYING;

    return (
      <div class="customer-code">
        {this.renderSentInfo()}

        <div>
          <sc-verification-code total={6} loading={this.busy} onChange={((value: string) => this.verifyCode(value)) as any} />
        </div>

        {isVerifying && (
          <div class="customer-code__verifying">
            <sc-spinner />
            <span>{__('Verifying...', 'surecart')}</span>
          </div>
        )}

        {isExpired && (
          <p class="customer-code__expired" role="alert">
            {__('Code expired.', 'surecart')}{' '}
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                this.resendCode();
              }}
            >
              {__('Send new code', 'surecart')}
            </a>
          </p>
        )}

        {!isExpired && (!!this.error || !!this.codeError) && <p class="customer-code__error" role="alert" innerHTML={this.error || this.codeError}></p>}

        {this.renderCodeFooter()}
      </div>
    );
  }

  render() {
    return (
      <Host>
        <div class="customer-login">{this.mode === 'code' ? this.renderCodeView() : this.renderPasswordView()}</div>
      </Host>
    );
  }
}
