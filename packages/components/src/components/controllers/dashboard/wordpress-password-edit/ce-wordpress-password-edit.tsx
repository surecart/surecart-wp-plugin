import { Component, h, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';

import apiFetch from '../../../../functions/fetch';
import { WordPressUser } from '../../../../types';

@Component({
  tag: 'ce-wordpress-password-edit',
  styleUrl: 'ce-wordpress-password-edit.css',
  shadow: true,
})
export class CeWordPressPasswordEdit {
  @Prop() heading: string;
  @Prop() successUrl: string;
  @Prop() user: WordPressUser;
  @State() loading: boolean;
  @State() error: string;

  renderEmpty() {
    return <slot name="empty">{__('User not found.', 'surecart')}</slot>;
  }

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
        },
      });
      if (this.successUrl) {
        window.location.assign(this.successUrl);
      } else {
        this.loading = false;
      }
    } catch (e) {
      this.error = e?.message || __('Something went wrong', 'surecart');
      this.loading = false;
    }
  }

  render() {
    return (
      <ce-dashboard-module class="customer-details" error={this.error}>
        <span slot="heading">{this.heading || __('Update Password', 'surecart')} </span>

        <ce-card>
          <ce-form onCeFormSubmit={e => this.handleSubmit(e)}>
            <ce-input label={__('New Password', 'surecart')} name="password" type="password" required />
            <ce-input label={__('Confirm New Password', 'surecart')} name="password_confirm" type="password" required />
            <div>
              <ce-button type="primary" full submit>
                {__('Update Password', 'surecart')}
              </ce-button>
            </div>
          </ce-form>
        </ce-card>

        {this.loading && <ce-block-ui spinner></ce-block-ui>}
      </ce-dashboard-module>
    );
  }
}
