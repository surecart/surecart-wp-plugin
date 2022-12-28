import { Component, Fragment, h, State, Watch } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import apiFetch from '../../../functions/fetch';
import { ResponseError, VerificationCode } from '../../../types';

@Component({
  tag: 'sc-login-form',
  styleUrl: 'sc-login-form.scss',
  shadow: true,
})
export class ScLogin {
  private passwordInput: HTMLScInputElement;
  private codeInput: HTMLScInputElement;

  @State() step: number = 0;
  @State() email: string = '';
  @State() password: string = '';
  @State() verifyCode: string = '';
  @State() loading: boolean;
  @State() error: ResponseError;

  /** Focus the password field automatically on password step. */
  @Watch('step')
  handleStepChange() {
    if (this.step === 1) {
      setTimeout(() => {
        this.passwordInput?.triggerFocus?.();
      }, 50);
    }
    if (this.step === 2) {
      setTimeout(() => {
        this.codeInput?.triggerFocus?.();
      }, 50);
    }
  }

  /** Clear out error when loading happens. */
  @Watch('loading')
  handleLoadingChange(val) {
    if (val) {
      this.error = null;
    }
  }

  @Watch('verifyCode')
  handleVerifyCodeChange(val) {
    if (val?.length >= 6) {
      this.submitCode();
    }
  }

  /** Handle request errors. */
  handleError(e) {
    console.error(this.error);
    this.error = e || { message: __('Something went wrong', 'surecart') };
  }

  /** Submit for verification codes */
  async createLoginCode() {
    try {
      this.loading = true;
      await apiFetch({
        method: 'POST',
        path: 'surecart/v1/verification_codes',
        data: {
          login: this.email,
        },
      });
      this.step = this.step + 1;
    } catch (e) {
      this.handleError(e);
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
      this.handleError(e);
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
      this.handleError(e);
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
      this.step = this.step + 1;
    } catch (e) {
      this.handleError(e);
    } finally {
      this.loading = false;
    }
  }

  renderInner() {
    if (this.step === 2) {
      return (
        <Fragment>
          <div class="login-form__title" part="title">
            {__('Check your email for a confirmation code', 'surecart')}
          </div>
          <div>
            <sc-form onScFormSubmit={() => this.submitCode()}>
              <sc-input
                label={__('Confirmation code', 'surecart')}
                type="text"
                ref={el => (this.codeInput = el as HTMLScInputElement)}
                autofocus
                required
                onScInput={e => (this.verifyCode = (e.target as HTMLScInputElement).value)}
              ></sc-input>
              <sc-button type="primary" submit full>
                <sc-icon name="lock" slot="prefix" />
                {__('Login with Code', 'surecart')}
              </sc-button>
            </sc-form>
          </div>
        </Fragment>
      );
    }

    if (this.step === 1 && this.email) {
      return (
        <Fragment>
          <div class="login-form__title" part="title">
            <div>{__('Welcome', 'surecart')}</div>
            <sc-button style={{ fontSize: '18px' }} size="small" pill caret onClick={() => (this.step = this.step - 1)}>
              <sc-icon name="user" slot="prefix"></sc-icon>
              {this.email}
            </sc-button>
          </div>
          <sc-flex flexDirection="column" style={{ '--sc-flex-column-gap': 'var(--sc-spacing-large)' }}>
            <div>
              <sc-form onScFormSubmit={() => this.createLoginCode()}>
                <sc-button type="primary" submit full>
                  <sc-icon name="mail" slot="prefix" />
                  {__('Send a login code', 'surecart')}
                </sc-button>
              </sc-form>
              <sc-divider style={{ '--spacing': '0.5em' }}>{__('or', 'surecart')}</sc-divider>
              <sc-form onScFormSubmit={() => this.login()}>
                <sc-input
                  label={__('Enter your password', 'surecart')}
                  type="password"
                  ref={el => (this.passwordInput = el as HTMLScInputElement)}
                  onKeyDown={e => e.key === 'Enter' && this.login()}
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
          </sc-flex>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <div class="login-form__title" part="title">
          <slot name="title"></slot>
        </div>

        <sc-form onScFormSubmit={() => this.checkEmail()}>
          <sc-input
            type="text"
            value={this.email}
            label={__('Username or Email Address', 'surecart')}
            onScInput={e => (this.email = (e.target as HTMLScInputElement).value)}
            onKeyDown={e => e.key === 'Enter' && this.checkEmail()}
            required
            autofocus
          />
          <sc-button type="primary" submit full>
            <sc-icon name="arrow-right" slot="suffix" />
            {__('Next', 'surecart')}
          </sc-button>
        </sc-form>
      </Fragment>
    );
  }

  render() {
    return (
      <div class="login-form">
        <sc-card>
          {!!this.error && (
            <sc-alert open type="danger" closable onScHide={() => (this.error = null)}>
              <span slot="title" innerHTML={this.error?.message}></span>
              {(this.error?.additional_errors || []).map(({ message }) => (
                <div innerHTML={message}></div>
              ))}
            </sc-alert>
          )}
          {this.renderInner()}
        </sc-card>
        {this.loading && <sc-block-ui spinner style={{ 'zIndex': '9', '--sc-block-ui-opacity': '0.5' }}></sc-block-ui>}
      </div>
    );
  }
}
