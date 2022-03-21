import { Component, h, State, Watch } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import apiFetch from '../../../functions/fetch';

@Component({
  tag: 'sc-login-form',
  styleUrl: 'sc-login-form.scss',
  shadow: true,
})
export class ScLogin {
  private emailInput: HTMLScInputElement;
  private passwordInput: HTMLScInputElement;

  @State() step: string = '';
  @State() email: string = '';
  @State() password: string = '';
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

  handleEmailChange() {
    this.email = this.emailInput.value;
  }

  /** Get all subscriptions */
  async submitMagicLink() {
    try {
      this.loading = true;
      await apiFetch({
        method: 'POST',
        path: 'surecart/v1/customer_links',
        data: {
          email: this.email,
          return_url: window.location.href,
        },
      });
      this.step = 'complete';
    } catch (e) {
      if (e?.message) {
        this.error = e.message;
      } else {
        this.error = __('Something went wrong', 'surecart');
      }
      console.error(this.error);
    } finally {
      this.loading = false;
    }
  }

  async login() {
    try {
      this.loading = true;
      const { redirect_url } = await apiFetch({
        method: 'POST',
        path: 'surecart/v1/login',
        data: {
          login: this.email,
          password: this.password,
        },
      });

      if (redirect_url) {
        window.location.replace(redirect_url);
      } else {
        window.location.reload();
      }
    } catch (e) {
      console.error(this.error);
      this.loading = false;
      if (e?.message) {
        this.error = e.message;
      } else {
        this.error = __('Something went wrong', 'surecart');
      }
    }
  }

  renderInner() {
    if (this.step === 'complete') {
      return (
        <sc-alert type="success" open>
          <sc-icon slot="icon" name="check"></sc-icon>
          <span slot="title">{__('Sent!', 'surecart')}</span>
          <p>{__('You should receive an email shortly with a link to login.', 'surecart')}</p>
        </sc-alert>
      );
    }

    if (this.step === 'password' && this.email) {
      return (
        <div>
          <sc-form onScFormSubmit={() => this.submitMagicLink()}>
            <sc-button type="primary" submit full>
              <sc-icon name="mail" slot="prefix" />
              {__('Send a magic link', 'surecart')}
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
      <sc-form onScFormSubmit={() => (this.step = 'password')}>
        <sc-input
          ref={el => (this.emailInput = el as HTMLScInputElement)}
          label="Email Address"
          onScChange={() => this.handleEmailChange()}
          required
          autofocus
          type="email"
        ></sc-input>
        <sc-button type="primary" submit full>
          <sc-icon name="arrow-right" slot="suffix" />
          {__('Next', 'surecart')}
        </sc-button>
      </sc-form>
    );
  }

  renderError() {
    if (this.error) {
      return (
        <sc-alert open type="danger">
          <span slot="title">{__('Error', 'surecart')}</span>
          <span innerHTML={this.error}></span>
        </sc-alert>
      );
    }
  }

  render() {
    return (
      <div class="login-form">
        <div class="login-form__title" part="title">
          <slot name="title"></slot>
        </div>
        <sc-card>{this.renderInner()}</sc-card>
        {this.loading && <sc-block-ui spinner></sc-block-ui>}
        {this.renderError()}
      </div>
    );
  }
}
