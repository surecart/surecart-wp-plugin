import { Component, h, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';

import apiFetch from '../../../../functions/fetch';
import { WordPressUser } from '../../../../types';

@Component({
  tag: 'sc-wordpress-user-edit',
  styleUrl: 'sc-wordpress-user-edit.css',
  shadow: true,
})
export class ScWordPressUserEdit {
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
    try {
      const { email, first_name, last_name, name } = await e.target.getFormJson();
      await apiFetch({
        path: `wp/v2/users/me`,
        method: 'PATCH',
        data: {
          first_name,
          last_name,
          email,
          name,
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
      <sc-dashboard-module class="account-details" error={this.error}>
        <span slot="heading">{this.heading || __('Account Details', 'surecart')} </span>

        <sc-card>
          <sc-form onScFormSubmit={e => this.handleSubmit(e)}>
            <sc-input label={__('Billing Email', 'surecart')} name="email" value={this.user?.email} required />
            <sc-columns style={{ '--sc-column-spacing': 'var(--sc-spacing-medium)' }}>
              <sc-column>
                <sc-input label={__('First Name', 'surecart')} name="first_name" value={this.user?.first_name} />
              </sc-column>
              <sc-column>
                <sc-input label={__('Last Name', 'surecart')} name="last_name" value={this.user?.last_name} />
              </sc-column>
            </sc-columns>
            <sc-input label={__('Display Name', 'surecart')} name="name" value={this.user?.display_name} />
            <div>
              <sc-button type="primary" full submit>
                {__('Save', 'surecart')}
              </sc-button>
            </div>
          </sc-form>
        </sc-card>

        {this.loading && <sc-block-ui spinner></sc-block-ui>}
      </sc-dashboard-module>
    );
  }
}
