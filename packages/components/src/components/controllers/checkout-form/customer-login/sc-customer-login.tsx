/**
 * External dependencies.
 */
import { Component, Fragment, h, Host, Prop, State } from '@stencil/core';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { VerificationCode } from 'src/types';
import { state as userState } from '@store/user';

@Component({
  tag: 'sc-customer-login',
  styleUrl: 'sc-customer-login.scss',
  shadow: false,
})
export class ScCustomerLogin {
  /** The user object */
  @Prop() user: any = null;

  /** Is verification code matched */
  @State() matched: boolean = false;

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

  getEmailPreview() {
    if (!this.user?.email) return '';
    const emailParts = this.user?.email.split('@');
    return emailParts[0].slice(0, 2) + '..@' + emailParts[1];
  }

  async verifyCode(code: string) {
    try {
      this.error = '';
      this.verifying = true;
      const { verified } = (await apiFetch({
        method: 'POST',
        path: 'surecart/v1/verification_codes/verify',
        data: {
          login: this.user?.email,
          code: code,
        },
      })) as VerificationCode;
      this.verifying = false;
      this.verified = verified;

      if (!verified) {
        throw { message: __('Verification code is not valid. Please try again.', 'surecart') };
      }

      // window.location.reload();
      
    } catch (e) {
      this.error = e?.message || __('Verification code is not valid. Please try again.', 'surecart');
    } finally {
      this.verifying = false;
    }
  }

  async resendCode() {
    try {
      this.error = '';
      this.codeResending = true;
      this.user = await apiFetch({
        method: 'POST',
        path: 'surecart/v1/verification_codes',
        data: {
          login: this.user?.email,
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

  async login() {
    try {
      this.error = '';
      this.busy = true;
      const { name, email, nonce } = (await apiFetch({
        method: 'POST',
        path: 'surecart/v1/login',
        data: {
          login: this.user?.email,
          password: this.password,
        },
      })) as any;
      this.busy = false;
      this.verified = true;
      // TODO: refactor this to use the user state only.
      this.user.name = name;
      this.user.email = email;

      userState.loggedIn = true;
      userState.email = email;
      userState.name = name;

      // Update nonce in cookie to be able to use it in the next request.
      if (!!nonce) {
        document.cookie = `wp_rest=${nonce}; path=/`;
      }
    } catch (e) {
      this.error = e?.message || __('Login failed. Please try again.', 'surecart');
    } finally {
      this.busy = false;
    }
  }

  renderPasswordView() {
    return (
      <div class="use-password">
        <sc-flex alignItems="center" justifyContent="center">
          <sc-input type="password" placeholder={__('Password', 'surecart')} required disabled={this.busy} onScInput={(e: any) => (this.password = e.target.value)} />
          <sc-button size="medium" type="primary" onClick={() => this.login()}>
            {__('Login', 'surecart')} &nbsp; <sc-icon name="user" />
          </sc-button>
        </sc-flex>
      </div>
    );
  }

  renderCodeView() {
    return (
      <div>
        <p class="code-hint">
          {__('Enter the code sent to', 'surecart')} <span class="reset-email-preview">{this.getEmailPreview()}</span> {__('to securely use your saved information.', 'surecart')}
        </p>
        <div>
          <div class="reset-code-area">
            <sc-verification-code total={6} onChange={value => this.verifyCode(value)} />
            <div class="matched-icon">
              {this.verifying && <sc-spinner />}
              {this.verified && <sc-icon name="check" />}
            </div>
          </div>
          {(!!this.error || !!this.codeError) && <p class="code-sent-error">{this.error || this.codeError}</p>}
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
      <Host>
        <div class="customer-login-area">
          <sc-flex alignItems="center" justifyContent="space-between">
            <p>{__('Email', 'surecart')}</p>
            <span class="customer-email">{this.user?.email}</span>
          </sc-flex>
          <sc-divider></sc-divider>

          {this.mode === 'code' ? this.renderCodeView() : this.renderPasswordView()}

          {/* Change mode UI - Password view or code view */}
          <div class="change-mode">
            <a href="#" onClick={() => (this.mode = this.mode === 'code' ? 'password' : 'code')}>
              {this.mode === 'code' ? __('Use Password', 'surecart') : __('Use Code', 'surecart')} {this.mode === 'code' ? <sc-icon name="lock" /> : '→'}
            </a>
          </div>
        </div>
      </Host>
    );
  }
}
