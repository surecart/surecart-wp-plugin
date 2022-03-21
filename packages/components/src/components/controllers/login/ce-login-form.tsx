import { Component, h, State, Watch } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import apiFetch from '../../../functions/fetch';

@Component({
  tag: 'ce-login-form',
  styleUrl: 'ce-login-form.scss',
  shadow: true,
})
export class CeLogin {
  private emailInput: HTMLCeInputElement;
  private passwordInput: HTMLCeInputElement;

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
        path: 'checkout-engine/v1/customer_links',
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
        path: 'checkout-engine/v1/login',
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
        <ce-alert type="success" open>
          <ce-icon slot="icon" name="check"></ce-icon>
          <span slot="title">{__('Sent!', 'surecart')}</span>
          <p>{__('You should receive an email shortly with a link to login.', 'surecart')}</p>
        </ce-alert>
      );
    }

    if (this.step === 'password' && this.email) {
      return (
        <div>
          <ce-form onCeFormSubmit={() => this.submitMagicLink()}>
            <ce-button type="primary" submit full>
              <ce-icon name="mail" slot="prefix" />
              {__('Send a magic link', 'surecart')}
            </ce-button>
          </ce-form>
          <ce-divider>{__('or', 'surecart')}</ce-divider>
          <ce-form onCeFormSubmit={() => this.login()}>
            <ce-input
              label={__('Enter your password', 'surecart')}
              type="password"
              ref={el => (this.passwordInput = el as HTMLCeInputElement)}
              autofocus
              required
              onCeChange={e => (this.password = (e.target as HTMLCeInputElement).value)}
            ></ce-input>
            <ce-button type="primary" outline submit full>
              <ce-icon name="lock" slot="prefix" />
              {__('Login', 'surecart')}
            </ce-button>
          </ce-form>
        </div>
      );
    }

    return (
      <ce-form onCeFormSubmit={() => (this.step = 'password')}>
        <ce-input
          ref={el => (this.emailInput = el as HTMLCeInputElement)}
          label="Email Address"
          onCeChange={() => this.handleEmailChange()}
          required
          autofocus
          type="email"
        ></ce-input>
        <ce-button type="primary" submit full>
          <ce-icon name="arrow-right" slot="suffix" />
          {__('Next', 'surecart')}
        </ce-button>
      </ce-form>
    );
  }

  renderError() {
    if (this.error) {
      return (
        <ce-alert open type="danger">
          <span slot="title">{__('Error', 'surecart')}</span>
          <span innerHTML={this.error}></span>
        </ce-alert>
      );
    }
  }

  render() {
    return (
      <div class="login-form">
        <div class="login-form__title" part="title">
          <slot name="title"></slot>
        </div>
        <ce-card>{this.renderInner()}</ce-card>
        {this.loading && <ce-block-ui spinner></ce-block-ui>}
        {this.renderError()}
      </div>
    );
  }
}
