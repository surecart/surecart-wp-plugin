import { Component, h, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';

import apiFetch from '../../../../functions/fetch';
import { WordPressUser } from '../../../../types';

@Component({
  tag: 'sc-wordpress-password-edit',
  styleUrl: 'sc-wordpress-password-edit.css',
  shadow: true,
})
export class ScWordPressPasswordEdit {
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
      <sc-dashboard-module class="customer-details" error={this.error}>
        <span slot="heading">{this.heading || __('Update Password', 'surecart')} </span>

        <sc-card>
          <sc-form onScFormSubmit={e => this.handleSubmit(e)}>
            <sc-input label={__('New Password', 'surecart')} name="password" type="password" required />
            <sc-input label={__('Confirm New Password', 'surecart')} name="password_confirm" type="password" required />
            <div>
              <sc-button type="primary" full submit>
                {__('Update Password', 'surecart')}
              </sc-button>
            </div>
          </sc-form>
        </sc-card>

        {this.loading && <sc-block-ui spinner></sc-block-ui>}
      </sc-dashboard-module>
    );
  }
}
