import { Component, h, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';

import apiFetch from '../../../../functions/fetch';
import { WordPressUser } from '../../../../types';

@Component({
  tag: 'ce-wordpress-user-edit',
  styleUrl: 'ce-wordpress-user-edit.css',
  shadow: true,
})
export class CeWordPressUserEdit {
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
      <ce-dashboard-module class="account-details" error={this.error}>
        <span slot="heading">{this.heading || __('Account Details', 'surecart')} </span>

        <ce-card>
          <ce-form onCeFormSubmit={e => this.handleSubmit(e)}>
            <ce-input label={__('Billing Email', 'surecart')} name="email" value={this.user?.email} required />
            <ce-columns style={{ '--ce-column-spacing': 'var(--ce-spacing-medium)' }}>
              <ce-column>
                <ce-input label={__('First Name', 'surecart')} name="first_name" value={this.user?.first_name} />
              </ce-column>
              <ce-column>
                <ce-input label={__('Last Name', 'surecart')} name="last_name" value={this.user?.last_name} />
              </ce-column>
            </ce-columns>
            <ce-input label={__('Display Name', 'surecart')} name="name" value={this.user?.display_name} />
            <div>
              <ce-button type="primary" full submit>
                {__('Save', 'surecart')}
              </ce-button>
            </div>
          </ce-form>
        </ce-card>

        {this.loading && <ce-block-ui spinner></ce-block-ui>}
      </ce-dashboard-module>
    );
  }
}
