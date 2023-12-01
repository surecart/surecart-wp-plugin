/**
 * External dependencies.
 */
import { Component, Fragment, h, Prop, State, Event, EventEmitter } from '@stencil/core';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { state as userState } from '@store/user';

@Component({
  tag: 'sc-customer-login',
  styleUrl: 'sc-customer-login.scss',
  shadow: false,
})
export class ScCustomerLogin {
  /** The mode of the login */
  @State() mode: 'code' | 'password' = 'code';

  /** Is the component busy */
  @State() busy: boolean = false;

  /** Is verifying code */
  @State() verifying: boolean = false;

  /** Is code resending */
  @State() codeResending: boolean = false;

  /** Code sent label */
  @State() codeSentLabel: string = __('Resend Code', 'surecart');

  /** Code sent icon */
  @State() codeSentIcon: string = '';

  /** Verified */
  @State() verified: boolean = false;

  /** Error */
  @State() error: string = '';

  /** Code Error comin from the parent */
  @Prop() codeError: string = '';

  /** Login Password */
  @State() password: string = '';

  /** Show Verification clear button or not */
  @State() showVerificationClearButton: boolean = false;

  /** Clear Codes event */
  @Event() scClearVerificationCodes: EventEmitter<void>;

  async verifyCode(code: string) {
    // If not valid email and code, then return.
    if (!userState.email || !code) {
      return;
    }

    try {
      this.error = '';
      this.verifying = true;
      this.showVerificationClearButton = false;

      const user = (await apiFetch({
        method: 'POST',
        path: 'surecart/v1/verification_codes/verify',
        data: {
          login: userState.email,
          code: code,
        },
      })) as any;
      this.verified = user?.verified;

      if (!user?.verified) {
        throw { message: __('Verification code is not valid. Please try again.', 'surecart') };
      }

      // Update userState and make the user as logged in user.
      userState.loggedIn = true;
      userState.name = user?.name || 'N/A';
    } catch (e) {
      if (e.code === 'not_found') {
        this.error = __('Verification code is not valid. Please try again.', 'surecart');
      } else {
        this.error = e?.message || __('Verification code is not valid. Please try again.', 'surecart');
      }
      this.verified = false;
      this.showVerificationClearButton = true;
    } finally {
      this.scClearVerificationCodes.emit();
      this.verifying = false;
    }
  }

  async resendCode() {
    try {
      this.error = '';
      this.codeResending = true;
      this.scClearVerificationCodes.emit();
      await apiFetch({
        method: 'POST',
        path: 'surecart/v1/verification_codes',
        data: {
          login: userState.email,
        },
      });

      this.codeSentLabel = __('Code sent', 'surecart');
      this.codeSentIcon = 'check';

      setTimeout(() => {
        this.codeSentLabel = __('Resend Code', 'surecart');
        this.codeSentIcon = '';
      }, 3000);
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

        setTimeout(() => {
          this.error = '';
        }, 3000);
      }
    });
  }

  async loginByPassword(e: any) {
    e.preventDefault();

    try {
      this.error = '';
      this.busy = true;
      const { name, email } = (await apiFetch({
        method: 'POST',
        path: 'surecart/v1/login',
        data: {
          login: userState.email,
          password: this.password,
        },
      })) as any;
      this.busy = false;
      this.verified = true;

      userState.loggedIn = true;
      userState.matched = true;
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
      <div class="use-password">
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
      <div>
        <p class="code-hint">
          {__('Enter the code sent to', 'surecart')} <span class="reset-email-preview">{userState.email}</span> {__('to securely use your saved information.', 'surecart')}
        </p>
        <div>
          <div class="reset-code-area">
            <sc-verification-code total={6} onChange={value => this.verifyCode(value)} showClearButton={this.showVerificationClearButton} />
            <div class="matched-icon">
              {this.verifying && <sc-spinner />}
              {this.verified && <sc-icon name="check" />}
            </div>
          </div>
          {(!!this.error || !!this.codeError) && <p class="login-error">{this.error || this.codeError}</p>}
        </div>

        <div class="resend-code-button">
          <sc-button type="text" style={{ color: 'var(--sc-color-primary-500)' }} onClick={() => this.resendCode()} disabled={this.codeResending}>
            {this.codeResending ? (
              <sc-spinner />
            ) : (
              <Fragment>
                {!!this.codeSentIcon && (
                  <span style={{ color: 'var(--sc-color-success-900)' }}>
                    {this.codeSentLabel} <sc-icon name={this.codeSentIcon} />
                  </span>
                )}
                {!this.codeSentIcon && this.codeSentLabel}
              </Fragment>
            )}
          </sc-button>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div class="customer-login-area">
        <sc-customer-email-preview></sc-customer-email-preview>
        <sc-divider></sc-divider>

        {this.mode === 'code' ? this.renderCodeView() : this.renderPasswordView()}

        {/* Change mode UI - Password view or code view */}
        <div class="change-mode">
          <a href="#" onClick={() => (this.mode = this.mode === 'code' ? 'password' : 'code')}>
            {this.mode === 'code' ? __('Use Password', 'surecart') : __('Use Code', 'surecart')} {this.mode === 'code' ? <sc-icon name="lock" /> : '→'}
          </a>
        </div>
      </div>
    );
  }
}
