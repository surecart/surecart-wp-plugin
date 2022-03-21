import { Component, Element, h, Prop } from '@stencil/core';
import { __, _n, sprintf } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { Product, Purchase } from '../../../types';

@Component({
  tag: 'ce-downloads-list',
  styleUrl: 'ce-downloads-list.scss',
  shadow: true,
})
export class CeDownloadsList {
  @Element() el: HTMLCeDownloadsListElement;

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
        <ce-divider style={{ '--spacing': '0' }}></ce-divider>
        <slot name="empty">
          <ce-empty icon="download">{__("You don't have any downloads.", 'checkout_engine')}</ce-empty>
        </slot>
      </div>
    );
  }

  renderLoading() {
    return (
      <ce-card no-padding style={{ '--overflow': 'hidden' }}>
        <ce-stacked-list>
          <ce-stacked-list-row style={{ '--columns': '2' }} mobile-size={0}>
            <div style={{ padding: '0.5em' }}>
              <ce-skeleton style={{ width: '30%', marginBottom: '0.75em' }}></ce-skeleton>
              <ce-skeleton style={{ width: '20%' }}></ce-skeleton>
            </div>
          </ce-stacked-list-row>
        </ce-stacked-list>
      </ce-card>
    );
  }

  renderList() {
    return this.purchases.map(purchase => {
      return (
        <ce-stacked-list-row
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
          <ce-spacing
            style={{
              '--spacing': 'var(--ce-spacing-xx--small)',
            }}
          >
            <div>
              <strong>{(purchase?.product as Product)?.name}</strong>
            </div>
            <div class="download__details">
              {sprintf(
                _n('%s file', '%s files', (purchase?.product as Product)?.files?.pagination?.count, 'checkout_engine'),
                (purchase?.product as Product)?.files?.pagination?.count,
              )}{' '}
              &bull; <ce-format-bytes value={(purchase?.product as Product)?.files?.data.map(item => item.byte_size).reduce((prev, curr) => prev + curr, 0)}></ce-format-bytes>
            </div>
          </ce-spacing>

          <ce-icon name="chevron-right" slot="suffix"></ce-icon>
        </ce-stacked-list-row>
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
      <ce-card no-padding style={{ '--overflow': 'hidden' }}>
        <ce-stacked-list>{this.renderList()}</ce-stacked-list>
      </ce-card>
    );
  }

  render() {
    return (
      <ce-dashboard-module class="downloads-list" error={this.error}>
        <span slot="heading">
          <slot name="heading">{this.heading || __('Items', 'checkout_engine')}</slot>
        </span>

        <slot name="before"></slot>

        {!!this.allLink && (
          <ce-button type="link" href={this.allLink} slot="end">
            {__('View all', 'checkout_engine')}
            <ce-icon name="chevron-right" slot="suffix"></ce-icon>
          </ce-button>
        )}

        {this.renderContent()}

        <slot name="after"></slot>

        {this.busy && <ce-block-ui></ce-block-ui>}
      </ce-dashboard-module>
    );
  }
}
