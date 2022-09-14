import { Component, Fragment, h, Prop, State, Watch } from '@stencil/core';
import apiFetch from '../../../../functions/fetch';
import { __ } from '@wordpress/i18n';

@Component({
  tag: 'sc-password-nag',
  styleUrl: 'sc-password-nag.css',
  shadow: true,
})
export class ScPasswordNag {
  private input: HTMLScInputElement;
  @Prop({ mutable: true }) open: boolean = true;
  /** The type of alert. */
  @Prop({ reflect: true }) type: 'primary' | 'success' | 'info' | 'warning' | 'danger' = 'primary';
  /** The success url. */
  @Prop() successUrl: string;
  /** Set a new password */
  @State() set: boolean;
  @State() loading: boolean;
  @State() error: string;
  @State() success: boolean;

  @Watch('set')
  handleSetChange() {
    setTimeout(() => {
      this.input && this.input.triggerFocus();
    }, 50);
  }

  /** Dismiss the form. */
  async dismiss() {
    this.loading = true;
    this.error = '';
    try {
      await apiFetch({
        path: `wp/v2/users/me`,
        method: 'PATCH',
        data: {
          meta: {
            default_password_nag: false,
          },
        },
      });
      this.open = false;
    } catch (e) {
      this.error = e?.message || __('Something went wrong', 'surecart');
      this.loading = false;
    }
  }

  /** Handle password submit. */
  async handleSubmit(e) {
    this.loading = true;
    this.error = '';
    try {
      const { password, password_confirm } = await e.target.getFormJson();
      if (password !== password_confirm) {
        throw { message: __('Passwords do not match.', 'surecart') };
      }
      await apiFetch({
        path: `wp/v2/users/me`,
        method: 'PATCH',
        data: {
          password,
          meta: {
            default_password_nag: false,
          },
        },
      });
      this.dismiss();
      this.success = true;
    } catch (e) {
      this.error = e?.message || __('Something went wrong', 'surecart');
      this.loading = false;
    }
  }

  render() {
    if (this.success) {
      return (
        <sc-alert style={{ marginBottom: 'var(--sc-spacing-xx-large)' }} type="success" open>
          <span slot="title">{__('Succcess!', 'surecart')}</span>
          {__('You have successfully set your password.', 'surecart')}
        </sc-alert>
      );
    }

    return (
      <sc-alert
        type={this.type}
        open={this.open}
        exportparts="base, icon, text, title, message, close-icon"
        style={{ marginBottom: this.open ? 'var(--sc-spacing-xx-large)' : '0', position: 'relative' }}
      >
        {!!this.error && this.error}
        {this.set ? (
          <sc-dashboard-module class="customer-details">
            <span slot="heading">{__('Set A Password', 'surecart')} </span>
            <sc-button type="text" size="small" slot="end" onClick={() => (this.set = false)}>
              <sc-icon name="x" slot="prefix" />
              {__('Cancel', 'surecart')}
            </sc-button>
            <sc-card>
              <sc-form onScFormSubmit={e => this.handleSubmit(e)}>
                <sc-input label={__('New Password', 'surecart')} name="password" type="password" required ref={el => (this.input = el as HTMLScInputElement)} />
                <sc-input label={__('Confirm New Password', 'surecart')} name="password_confirm" type="password" required />
                <div>
                  <sc-button type="primary" full submit busy={this.loading}>
                    {__('Update Password', 'surecart')}
                  </sc-button>
                </div>
              </sc-form>
            </sc-card>
          </sc-dashboard-module>
        ) : (
          <Fragment>
            <slot name="title" slot="title">
              {__('Reminder', 'surecart')}
            </slot>
            <slot>{__('You have not yet set a password. Please set a password for your account.', 'surecart')}</slot>
            <sc-flex justify-content="flex-start">
              <sc-button size="small" type="primary" onClick={() => (this.set = true)}>
                {__('Set A Password', 'surecart')}
              </sc-button>
              <sc-button size="small" type="text" onClick={() => this.dismiss()}>
                {__('Dismiss', 'surecart')}
              </sc-button>
            </sc-flex>
          </Fragment>
        )}
        {this.loading && <sc-block-ui spinner></sc-block-ui>}
      </sc-alert>
    );
  }
}
