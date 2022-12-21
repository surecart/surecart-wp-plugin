import { Component, h, State, Watch } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import apiFetch from '../../../functions/fetch';
import { VerificationCode } from '../../../types';

@Component({
  tag: 'sc-login-form',
  styleUrl: 'sc-login-form.scss',
  shadow: true,
})
export class ScLogin {
  private passwordInput: HTMLScInputElement;

  @State() step: string = '';
  @State() email: string = '';
  @State() password: string = '';
  @State() verifyCode: string = '';
  @State() loading: boolean;
  @State() error: string;

  /** Focus the password field automatically on password step. */
  @Watch('step')
  handleStepChange() {
    if (this.step === 'password') {
      setTimeout(() => {
        this.passwordInput.triggerFocus();
      }, 50);
    }
  }

  handleEmailChange(e) {
    this.email = (e.target as HTMLScInputElement).value;
  }

  /** Submit for verification codes */
  async createLoginCode() {
    try {
      this.loading = true;
      await apiFetch({
        method: 'POST',
        path: 'surecart/v1/verification_codes',
        data: {
          email: this.email,
        },
      });
      this.step = 'complete';
    } catch (e) {
      console.error(this.error);
      this.error = e?.message || __('Something went wrong', 'surecart');
    } finally {
      this.loading = false;
    }
  }

  /** Get all subscriptions */
  async submitCode() {
    try {
      this.loading = true;
      const { verified } = (await apiFetch({
        method: 'POST',
        path: 'surecart/v1/verification_codes/verify',
        data: {
          login: this.email,
          code: this.verifyCode,
        },
      })) as VerificationCode;
      if (!verified) {
        throw { message: __('Verification code is not valid. Please try again.', 'surecart') };
      }
      window.location.reload();
    } catch (e) {
      console.error(this.error);
      this.error = e?.message || __('Something went wrong', 'surecart');
    } finally {
      this.loading = false;
    }
  }

  async login() {
    try {
      this.loading = true;
      await apiFetch({
        method: 'POST',
        path: 'surecart/v1/login',
        data: {
          login: this.email,
          password: this.password,
        },
      });
      window.location.reload();
    } catch (e) {
      console.error(this.error);
      this.error = e?.message || __('Something went wrong', 'surecart');
    } finally {
      this.loading = false;
    }
  }

  async checkEmail() {
    try {
      this.loading = true;
      await apiFetch({
        method: 'POST',
        path: 'surecart/v1/check_email',
        data: {
          login: this.email,
        },
      });
      this.step = 'password';
    } catch (e) {
      console.error(this.error);
      this.error = e?.message || __('Something went wrong', 'surecart');
    } finally {
      this.loading = false;
    }
  }

  renderInner() {
    if (this.step === 'complete') {
      return (
        <div>
          <sc-alert type="success" open>
            <sc-icon slot="icon" name="check"></sc-icon>
            <span slot="title">{__('Sent!', 'surecart')}</span>
            <p>{__('You should receive an email shortly with a verification code.', 'surecart')}</p>
          </sc-alert>
          <sc-form onScFormSubmit={() => this.submitCode()}>
            <sc-input
              label={__('Enter your code', 'surecart')}
              type="text"
              ref={el => (this.passwordInput = el as HTMLScInputElement)}
              autofocus
              required
              onScInput={e => (this.verifyCode = (e.target as HTMLScInputElement).value)}
            ></sc-input>
            <sc-button type="primary" outline submit full>
              <sc-icon name="lock" slot="prefix" />
              {__('Login with Verify Code', 'surecart')}
            </sc-button>
          </sc-form>
        </div>
      );
    }

    if (this.step === 'password' && this.email) {
      return (
        <div>
          <sc-form onScFormSubmit={() => this.createLoginCode()}>
            <sc-button type="primary" submit full>
              <sc-icon name="mail" slot="prefix" />
              {__('Send a login code', 'surecart')}
            </sc-button>
          </sc-form>
          <sc-divider>{__('or', 'surecart')}</sc-divider>
          <sc-form onScFormSubmit={() => this.login()}>
            <sc-input
              label={__('Enter your password', 'surecart')}
              type="password"
              ref={el => (this.passwordInput = el as HTMLScInputElement)}
              autofocus
              required
              onScChange={e => (this.password = (e.target as HTMLScInputElement).value)}
            ></sc-input>
            <sc-button type="primary" outline submit full>
              <sc-icon name="lock" slot="prefix" />
              {__('Login', 'surecart')}
            </sc-button>
          </sc-form>
        </div>
      );
    }

    return (
      <sc-form onScFormSubmit={() => this.checkEmail()}>
        <sc-input type="text" label={__('Username or Email Address', 'surecart')} onScInput={e => (this.email = (e.target as HTMLScInputElement).value)} required autofocus />
        <sc-button type="primary" submit full>
          <sc-icon name="arrow-right" slot="suffix" />
          {__('Next', 'surecart')}
        </sc-button>
      </sc-form>
    );
  }

  render() {
    return (
      <div class="login-form">
        <div class="login-form__title" part="title">
          <slot name="title"></slot>
        </div>
        <sc-card>
          {!!this.error && (
            <sc-alert open type="danger">
              <span innerHTML={this.error}></span>
            </sc-alert>
          )}
          {this.renderInner()}
        </sc-card>
        {this.loading && <sc-block-ui spinner></sc-block-ui>}
      </div>
    );
  }
}
