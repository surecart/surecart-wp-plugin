import { Component, Fragment, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { WordPressUser } from '../../../../types';

@Component({
  tag: 'ce-wordpress-user',
  styleUrl: 'ce-wordpress-user.css',
  shadow: true,
})
export class CeWordPressUser {
  @Prop() heading: string;
  @Prop() user: WordPressUser;

  renderContent() {
    if (!this.user) {
      return this.renderEmpty();
    }

    return (
      <Fragment>
        {!!this?.user?.display_name && (
          <ce-stacked-list-row style={{ '--columns': '3' }} mobileSize={480}>
            <div>
              <strong>{__('Display Name', 'checkout_engine')}</strong>
            </div>
            <div>{this.user?.display_name}</div>
            <div></div>
          </ce-stacked-list-row>
        )}
        {!!this?.user?.email && (
          <ce-stacked-list-row style={{ '--columns': '3' }} mobileSize={480}>
            <div>
              <strong>{__('Account Email', 'checkout_engine')}</strong>
            </div>
            <div>{this.user?.email}</div>
            <div></div>
          </ce-stacked-list-row>
        )}

        {!!this?.user?.first_name && (
          <ce-stacked-list-row style={{ '--columns': '3' }} mobileSize={480}>
            <div>
              <strong>{__('First Name', 'checkout_engine')}</strong>
            </div>
            <div>{this.user?.first_name}</div>
            <div></div>
          </ce-stacked-list-row>
        )}
        {!!this?.user?.last_name && (
          <ce-stacked-list-row style={{ '--columns': '3' }} mobileSize={480}>
            <div>
              <strong>{__('Last Name', 'checkout_engine')}</strong>
            </div>
            <div>{this.user?.last_name}</div>
            <div></div>
          </ce-stacked-list-row>
        )}
      </Fragment>
    );
  }

  renderEmpty() {
    return <slot name="empty">{__('User not found.', 'checkout_engine')}</slot>;
  }

  render() {
    return (
      <ce-dashboard-module class="customer-details">
        <span slot="heading">{this.heading || __('Account Details', 'checkout_engine')} </span>

        <ce-button
          type="link"
          href={addQueryArgs(window.location.href, {
            action: 'edit',
            model: 'user',
          })}
          slot="end"
        >
          <ce-icon name="edit-3" slot="prefix"></ce-icon>
          {__('Update', 'checkout_engine')}
        </ce-button>

        <ce-card no-padding>
          <ce-stacked-list>{this.renderContent()}</ce-stacked-list>
        </ce-card>
      </ce-dashboard-module>
    );
  }
}
