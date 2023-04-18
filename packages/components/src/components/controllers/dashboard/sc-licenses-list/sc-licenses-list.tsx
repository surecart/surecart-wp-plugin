import { Component, Element, h, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { License } from '../../../../types';
import { onFirstVisible } from '../../../../functions/lazy';
import apiFetch from '../../../../functions/fetch';
import { addQueryArgs } from '@wordpress/url';

@Component({
  tag: 'sc-licenses-list',
  styleUrl: 'sc-licenses-list.css',
  shadow: true,
})
export class ScLicensesList {
  @Element() el: HTMLScLicensesListElement;

  /** Query to fetch licenses */
  @Prop({ mutable: true }) query: {
    page: number;
    per_page: number;
  } = {
    page: 1,
    per_page: 10,
  };
  /**The heading of the licenses */
  @Prop() heading: string = __('Licenses', 'surecart');
  /**Whether the current user is customer */
  @Prop() isCustomer: boolean;
  /**View all link */
  @Prop() allLink: string;

  @State() licenses: License[] = [];
  @State() copied: boolean = false;
  @State() loading: boolean = false;
  @State() error: string = '';
  @State() pagination: {
    total: number;
    total_pages: number;
  } = {
    total: 0,
    total_pages: 0,
  };
  @State() selectedLicenseId: string;
  @State() showDeleteConfirm: boolean = false;

  /** Only fetch if visible */
  componentWillLoad() {
    onFirstVisible(this.el, () => {
      this.initialFetch();
    });
  }

  async initialFetch() {
    try {
      this.loading = true;
      await this.getLicenses();
    } catch (e) {
      console.error(this.error);
      this.error = e?.message || __('Something went wrong', 'surecart');
    } finally {
      this.loading = false;
    }
  }

  async getLicenses() {
    if (!this.isCustomer) {
      return;
    }

    const response = (await await apiFetch({
      path: addQueryArgs('surecart/v1/licenses', {
        expand: ['purchase', 'activations'],
        ...this.query,
      }),
      parse: false,
    })) as Response;

    this.pagination = {
      total: parseInt(response.headers.get('X-WP-Total')),
      total_pages: parseInt(response.headers.get('X-WP-TotalPages')),
    };
    this.licenses = (await response.json()) as License[];
    return this.licenses;
  }

  async deleteLicense() {
    try {
      this.loading = true;

      await apiFetch({
        path: `surecart/v1/licenses/${this.selectedLicenseId}`,
        method: 'DELETE',
      });
      this.initialFetch();
      this.onCloseDeleteModal();
    } catch (e) {
      console.error(this.error);
      this.error = e?.message || __('Something went wrong', 'surecart');
    } finally {
      this.loading = false;
    }
  }

  renderStatus(status: string) {
    if (status === 'active') {
      return <sc-tag type="success">{__('Active', 'surecart')}</sc-tag>;
    }
    if (status === 'revoked') {
      return <sc-tag type="danger">{__('Revoked', 'surecart')}</sc-tag>;
    }
    if (status === 'inactive') {
      return <sc-tag type="info">{__('Inactive', 'surecart')}</sc-tag>;
    }

    return <sc-tag type="info">{status}</sc-tag>;
  }

  async copyKey(key: string) {
    try {
      await navigator.clipboard.writeText(key);
      this.copied = true;

      setTimeout(() => {
        this.copied = false;
      }, 2000);
    } catch (err) {
      console.error(err);
      alert(__('Error copying to clipboard', 'surecart'));
    }
  }

  renderLoading() {
    return (
      <sc-card noPadding>
        <sc-stacked-list>
          <sc-stacked-list-row style={{ '--columns': '4' }} mobile-size={500}>
            {[...Array(4)].map(() => (
              <sc-skeleton style={{ width: '100px', display: 'inline-block' }}></sc-skeleton>
            ))}
          </sc-stacked-list-row>
        </sc-stacked-list>
      </sc-card>
    );
  }

  renderEmpty() {
    return (
      <div>
        <sc-divider style={{ '--spacing': '0' }}></sc-divider>
        <slot name="empty">
          <sc-empty icon="">{__("You don't have any licenses.", 'surecart')}</sc-empty>
        </slot>
      </div>
    );
  }

  renderContent() {
    if (this.loading) {
      return this.renderLoading();
    } else if (this.licenses?.length === 0) {
      return this.renderEmpty();
    }

    return (
      <sc-card no-padding>
        <sc-table>
          <sc-table-cell slot="head">{__('Key', 'surecart')}</sc-table-cell>
          <sc-table-cell slot="head" style={{ width: '100px' }}>
            {__('Status', 'surecart')}
          </sc-table-cell>
          <sc-table-cell slot="head" style={{ width: '100px' }}>
            {__('Activations', 'surecart')}
          </sc-table-cell>
          <sc-table-cell slot="head" style={{ width: '100px' }}></sc-table-cell>
          {this.licenses.map(({ id, key, status, activations, activation_limit }) => {
            return (
              <sc-table-row style={{ '--columns': '3' }}>
                <sc-table-cell>
                  <sc-input value={key} readonly>
                    <sc-button type="default" size="small" slot="suffix" onClick={() => this.copyKey(key)}>
                      {this.copied ? __('Copied!', 'surecart') : __('Copy', 'surecart')}
                    </sc-button>
                  </sc-input>
                </sc-table-cell>
                <sc-table-cell>{this.renderStatus(status)}</sc-table-cell>
                <sc-table-cell>
                  {activations?.pagination?.count} / {activation_limit || <span>&infin;</span>}
                </sc-table-cell>
                <sc-table-cell>
                  <sc-button
                    onClick={() => {
                      this.selectedLicenseId = id;
                      this.showDeleteConfirm = true;
                    }}
                  >
                    <sc-icon name="trash"></sc-icon>
                  </sc-button>
                </sc-table-cell>
              </sc-table-row>
            );
          })}
        </sc-table>
      </sc-card>
    );
  }

  onCloseDeleteModal = () => {
    this.showDeleteConfirm = false;
    this.selectedLicenseId = '';
  };

  renderConfirmDelete() {
    return (
      <sc-dialog open={this.showDeleteConfirm} style={{ '--body-spacing': 'var(--sc-spacing-x-large)' }} noHeader onScRequestClose={this.onCloseDeleteModal}>
        <sc-dashboard-module heading={__('Confirm', 'surecart')} style={{ '--sc-dashboard-module-spacing': 'var(--sc-spacing-x-large)', 'textAlign': 'center' }}>
          <span slot="description">{__('Are you sure you want to delete license?', 'surecart')}</span>
        </sc-dashboard-module>
        <div slot="footer">
          <sc-button type="text" onClick={this.onCloseDeleteModal} disabled={this.loading}>
            {__("Don't delete", 'surecart')}
          </sc-button>
          <sc-button type="primary" onClick={this.deleteLicense} disabled={this.loading}>
            {__('Delete license', 'surecart')}
          </sc-button>
        </div>
        {this.loading && <sc-block-ui style={{ '--sc-block-ui-opacity': '0.75' }} spinner />}
      </sc-dialog>
    );
  }

  render() {
    return (
      <sc-dashboard-module class="purchase" part="base" error={this.error}>
        <span slot="heading">
          <slot name="heading">{this.heading || __('License Keys', 'surecart')}</slot>
        </span>
        {!!this.allLink && !!this.licenses?.length && (
          <sc-button type="link" href={this.allLink} slot="end">
            {__('View all', 'surecart')}
            <sc-icon name="chevron-right" slot="suffix"></sc-icon>
          </sc-button>
        )}

        {this.renderContent()}
        {this.renderConfirmDelete()}
      </sc-dashboard-module>
    );
  }
}
