import { Component, Element, h, Prop } from '@stencil/core';
import { __, _n, sprintf } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { Media, Product, Purchase } from '../../../types';

@Component({
  tag: 'sc-downloads-list',
  styleUrl: 'sc-downloads-list.scss',
  shadow: true,
})
export class ScDownloadsList {
  @Element() el: HTMLScDownloadsListElement;

  @Prop() allLink: string;
  @Prop() heading: string;
  @Prop() busy: boolean;
  @Prop() loading: boolean;
  @Prop() requestNonce: string;
  @Prop() error: string;
  @Prop() purchases: Array<Purchase> = [];

  renderEmpty() {
    return (
      <div>
        <sc-divider style={{ '--spacing': '0' }}></sc-divider>
        <slot name="empty">
          <sc-empty icon="download">{__("You don't have any downloads.", 'surecart')}</sc-empty>
        </slot>
      </div>
    );
  }

  renderLoading() {
    return (
      <sc-card no-padding style={{ '--overflow': 'hidden' }}>
        <sc-stacked-list>
          <sc-stacked-list-row style={{ '--columns': '2' }} mobile-size={0}>
            <div style={{ padding: '0.5em' }}>
              <sc-skeleton style={{ width: '30%', marginBottom: '0.75em' }}></sc-skeleton>
              <sc-skeleton style={{ width: '20%' }}></sc-skeleton>
            </div>
          </sc-stacked-list-row>
        </sc-stacked-list>
      </sc-card>
    );
  }

  renderList() {
    return this.purchases.map(purchase => {
      return (
        <sc-stacked-list-row
          href={
            !purchase?.revoked
              ? addQueryArgs(window.location.href, {
                  action: 'edit',
                  model: 'download',
                  id: purchase.id,
                  nonce: this.requestNonce,
                })
              : null
          }
          key={purchase.id}
          mobile-size={0}
        >
          <sc-spacing
            style={{
              '--spacing': 'var(--sc-spacing-xx--small)',
            }}
          >
            <div>
              <strong>{(purchase?.product as Product)?.name}</strong>
            </div>
            <div class="download__details">
              {sprintf(
                _n('%s file', '%s files', (purchase?.product as Product)?.downloads?.pagination?.count, 'surecart'),
                (purchase?.product as Product)?.downloads?.pagination?.count,
              )}{' '}
              &bull;{' '}
              <sc-format-bytes
                value={(purchase?.product as Product)?.downloads?.data.map(item => (item?.media as Media)?.byte_size).reduce((prev, curr) => prev + curr, 0)}
              ></sc-format-bytes>
            </div>
          </sc-spacing>

          <sc-icon name="chevron-right" slot="suffix"></sc-icon>
        </sc-stacked-list-row>
      );
    });
  }

  renderContent() {
    if (this.loading) {
      return this.renderLoading();
    }

    if (this.purchases?.length === 0) {
      return this.renderEmpty();
    }

    return (
      <sc-card no-padding style={{ '--overflow': 'hidden' }}>
        <sc-stacked-list>{this.renderList()}</sc-stacked-list>
      </sc-card>
    );
  }

  render() {
    return (
      <sc-dashboard-module class="downloads-list" error={this.error}>
        <span slot="heading">
          <slot name="heading">{this.heading || __('Items', 'surecart')}</slot>
        </span>

        <slot name="before"></slot>

        {!!this.allLink && (
          <sc-button type="link" href={this.allLink} slot="end">
            {__('View all', 'surecart')}
            <sc-icon name="chevron-right" slot="suffix"></sc-icon>
          </sc-button>
        )}

        {this.renderContent()}

        <slot name="after"></slot>

        {this.busy && <sc-block-ui></sc-block-ui>}
      </sc-dashboard-module>
    );
  }
}
