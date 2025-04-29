import { Component, Element, h, Prop, State } from '@stencil/core';
import { __, sprintf } from '@wordpress/i18n';
import { License, Purchase, Product } from '../../../../types';
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

  @Prop({ mutable: true }) licenses: License[] = [];
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

  /** Only fetch if visible */
  componentWillLoad() {
    onFirstVisible(this.el, () => {
      this.initialFetch();
    });
  }

  nextPage() {
    this.query.page = this.query.page + 1;
    this.initialFetch();
  }

  prevPage() {
    this.query.page = this.query.page - 1;
    this.initialFetch();
  }

  async initialFetch() {
    try {
      this.loading = true;
      await this.getLicenses();
    } catch (e) {
      console.error(e);
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
        expand: ['purchase', 'purchase.product', 'activations'],
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

  renderStatus(status: string) {
    if (status === 'active') {
      return <sc-tag type="success">{__('Active', 'surecart')}</sc-tag>;
    }
    if (status === 'revoked') {
      return <sc-tag type="danger">{__('Revoked', 'surecart')}</sc-tag>;
    }
    if (status === 'inactive') {
      return <sc-tag type="info">{__('Not Activated', 'surecart')}</sc-tag>;
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
      <sc-card no-padding style={{ '--overflow': 'hidden' }}>
        <sc-stacked-list>
          <sc-stacked-list-row style={{ '--columns': '2' }} mobile-size={0}>
            <div style={{ padding: '0.5em' }}>
              <sc-skeleton style={{ width: '30%', marginBottom: '0.75em' }}></sc-skeleton>
              <sc-skeleton style={{ width: '20%', marginBottom: '0.75em' }}></sc-skeleton>
              <sc-skeleton style={{ width: '40%' }}></sc-skeleton>
            </div>
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
          <sc-empty icon="file-text">{__("You don't have any licenses.", 'surecart')}</sc-empty>
        </slot>
      </div>
    );
  }

  renderContent() {
    if (this.loading) {
      return this.renderLoading();
    }

    if (this.licenses?.length === 0) {
      return this.renderEmpty();
    }

    return (
      <sc-card no-padding>
        <sc-stacked-list>
          {this.licenses?.map(({ id, purchase, status, activation_limit, activation_count }) => (
            <sc-stacked-list-row
              key={id}
              href={addQueryArgs(window.location.href, {
                action: 'show',
                model: 'license',
                id,
              })}
              mobile-size={0}
            >
              <div class="license__details">
                <div class="license__name">{((purchase as Purchase)?.product as Product)?.name}</div>
                <div>
                  {this.renderStatus(status)} {sprintf(__('%1s of %2s Activations Used'), activation_count || 0, activation_limit || '∞')}
                </div>
              </div>
              {/* <div>{this.renderStatus(status)}</div> */}
              <sc-icon name="chevron-right" slot="suffix"></sc-icon>
              {/* <sc-tag type="info">{sprintf(__('%1s of %2s Activations Used'), activation_count || 0, activation_limit || '∞')}</sc-tag> */}
            </sc-stacked-list-row>
          ))}
        </sc-stacked-list>
      </sc-card>
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

        {!this.allLink && (
          <sc-pagination
            page={this.query.page}
            perPage={this.query.per_page}
            total={this.pagination.total}
            totalPages={this.pagination.total_pages}
            totalShowing={this?.licenses?.length}
            onScNextPage={() => this.nextPage()}
            onScPrevPage={() => this.prevPage()}
          />
        )}
      </sc-dashboard-module>
    );
  }
}
