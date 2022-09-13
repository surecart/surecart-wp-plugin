import { Component, Prop, h, Watch, State, Host, Listen, Event, EventEmitter } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import apiFetch from '../../../functions/fetch';

@Component({
  tag: 'sc-login-provider',
  styleUrl: 'sc-login-provider.css',
  shadow: true,
})
export class ScLoginProvider {
  private loginForm: HTMLScFormElement;

  /** Is the user logged in. */
  @Prop() loggedIn: boolean;

  @Event() scSetLoggedIn: EventEmitter<boolean>;
  @Event() scSetCustomer: EventEmitter<{ email: string; name?: string }>;

  @State() notice: boolean;
  @State() open: boolean;
  @State() loading: boolean;
  @State() error: string;

  /** Listen for open event. */
  @Listen('scLoginPrompt')
  handleLoginPrompt() {
    this.open = true;
  }

  /** Focus on first input. */
  @Watch('open')
  handleLoginDialogChange(val) {
    if (val) {
      setTimeout(() => {
        this.loginForm.querySelector('sc-input').triggerFocus();
      }, 100);
    }
  }

  @Watch('loggedIn')
  handleLoggedInChange(val, prev) {
    if (prev === false && val) {
      this.notice = true;

      setTimeout(() => {
        this.notice = false;
      }, 5000);
    }
  }

  /** Handle form submit. */
  async handleFormSubmit(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    this.error = null;

    const { login, password } = await e.target.getFormJson();

    try {
      this.loading = true;
      const { name, email } = (await apiFetch({
        method: 'POST',
        path: 'surecart/v1/login',
        data: {
          login,
          password,
        },
      })) as { name: string; email: string };
      this.scSetLoggedIn.emit(true);
      this.scSetCustomer.emit({ name, email });
      this.open = false;
    } catch (e) {
      console.error(e);
      this.error = e?.message || __('Something went wrong', 'surecart');
    } finally {
      this.loading = false;
    }
  }

  render() {
    return (
      <Host>
        {!!this.notice && (
          <sc-alert type="success" open style={{ marginBottom: 'var(--sc-form-row-spacing)' }} closable>
            <span slot="title">{__('Welcome back!', 'surecart')}</span>
            {__('You have logged in successfully.', 'surecart')}
          </sc-alert>
        )}

        <slot />

        {!this.loggedIn && (
          <sc-dialog label={__('Login to your account', 'surecart')} open={this.open} onScRequestClose={() => (this.open = false)}>
            <sc-form
              ref={el => (this.loginForm = el as HTMLScFormElement)}
              onScFormSubmit={e => {
                e.preventDefault();
                e.stopImmediatePropagation();
              }}
              onScSubmit={e => this.handleFormSubmit(e)}
            >
              {!!this.error && (
                <sc-alert type="danger" open={!!this.error}>
                  {this.error}
                </sc-alert>
              )}
              <sc-input label={__('Email or Username', 'surecart')} type="text" name="login" required autofocus={this.open}></sc-input>
              <sc-input label={__('Password', 'surecart')} type="password" name="password" required></sc-input>
              <sc-button type="primary" full loading={this.loading} submit>
                {__('Login', 'surecart')}
              </sc-button>
            </sc-form>
          </sc-dialog>
        )}
      </Host>
    );
  }
}
