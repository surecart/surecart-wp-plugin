import { Component, Fragment, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { WordPressUser } from '../../../../types';

@Component({
  tag: 'sc-wordpress-user',
  styleUrl: 'sc-wordpress-user.css',
  shadow: true,
})
export class ScWordPressUser {
  @Prop() heading: string;
  @Prop() user: WordPressUser;

  renderContent() {
    if (!this.user) {
      return this.renderEmpty();
    }

    return (
      <Fragment>
        {!!this?.user?.display_name && (
          <sc-stacked-list-row style={{ '--columns': '3' }} mobileSize={480}>
            <div>
              <strong>{__('Display Name', 'surecart')}</strong>
            </div>
            <div>{this.user?.display_name}</div>
            <div></div>
          </sc-stacked-list-row>
        )}
        {!!this?.user?.email && (
          <sc-stacked-list-row style={{ '--columns': '3' }} mobileSize={480}>
            <div>
              <strong>{__('Account Email', 'surecart')}</strong>
            </div>
            <div>{this.user?.email}</div>
            <div></div>
          </sc-stacked-list-row>
        )}

        {!!this?.user?.first_name && (
          <sc-stacked-list-row style={{ '--columns': '3' }} mobileSize={480}>
            <div>
              <strong>{__('First Name', 'surecart')}</strong>
            </div>
            <div>{this.user?.first_name}</div>
            <div></div>
          </sc-stacked-list-row>
        )}
        {!!this?.user?.last_name && (
          <sc-stacked-list-row style={{ '--columns': '3' }} mobileSize={480}>
            <div>
              <strong>{__('Last Name', 'surecart')}</strong>
            </div>
            <div>{this.user?.last_name}</div>
            <div></div>
          </sc-stacked-list-row>
        )}
      </Fragment>
    );
  }

  renderEmpty() {
    return <slot name="empty">{__('User not found.', 'surecart')}</slot>;
  }

  render() {
    return (
      <sc-dashboard-module class="customer-details">
        <span slot="heading">{this.heading || __('Account Details', 'surecart')} </span>

        <sc-button
          type="link"
          href={addQueryArgs(window.location.href, {
            action: 'edit',
            model: 'user',
          })}
          slot="end"
        >
          <sc-icon name="edit-3" slot="prefix"></sc-icon>
          {__('Update', 'surecart')}
        </sc-button>

        <sc-card no-padding>
          <sc-stacked-list>{this.renderContent()}</sc-stacked-list>
        </sc-card>
      </sc-dashboard-module>
    );
  }
}
