import { Component, h, Prop, State, Element } from '@stencil/core';
import apiFetch from '../../../../functions/fetch';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

import { Download, Media } from '../../../../types';
import { onFirstVisible } from '../../../../functions/lazy';

@Component({
  tag: 'sc-downloads-list',
  styleUrl: 'sc-downloads-list.scss',
  shadow: true,
})
export class ScDownloadsList {
  @Element() el: HTMLScDownloadsListElement;
  @Prop() customerId: string;
  @Prop() productId: string;
  @Prop() heading: string;
  @State() downloads: Download[];
  @State() downloading: string;
  @State() busy: boolean;
  @State() error: string;
  @State() pagination: {
    total: number;
    total_pages: number;
  } = {
    total: 0,
    total_pages: 0,
  };
  @Prop({ mutable: true }) query: any = {
    page: 1,
    per_page: 20,
  };

  componentWillLoad() {
    onFirstVisible(this.el, () => {
      this.fetchItems();
    });
  }

  async fetchItems() {
    if (!this.productId || !this.customerId) {
      return;
    }
    try {
      this.busy = true;
      await this.getItems();
    } catch (e) {
      console.error(this.error);
      this.error = e?.message || __('Something went wrong', 'surecart');
    } finally {
      this.busy = false;
    }
  }

  /** Get all subscriptions */
  async getItems() {
    const response = (await apiFetch({
      path: addQueryArgs(`surecart/v1/downloads/`, {
        product_ids: [this.productId],
        customer_ids: [this.customerId],
        downloadable: true,
        ...this.query,
      }),
      parse: false,
    })) as Response;
    this.pagination = {
      total: parseInt(response.headers.get('X-WP-Total')),
      total_pages: parseInt(response.headers.get('X-WP-TotalPages')),
    };
    this.downloads = (await response.json()) as Download[];
    return this.downloads;
  }

  nextPage() {
    this.query.page = this.query.page + 1;
    this.fetchItems();
  }

  prevPage() {
    this.query.page = this.query.page - 1;
    this.fetchItems();
  }

  async downloadItem(download) {
    if (download?.url) {
      this.downloadFile(download.url, download?.name ?? 'file');
      return;
    }

    const mediaId = download?.media?.id;
    if (!mediaId) return;

    try {
      this.downloading = mediaId;
      const media = (await apiFetch({
        path: addQueryArgs(`surecart/v1/customers/${this.customerId}/expose/${mediaId}`, {
          expose_for: 60,
        }),
      })) as Media;
      if (!media?.url) {
        throw {
          message: __('Could not download the file.', 'surecart'),
        };
      }
      this.downloadFile(media?.url, media.filename);
    } catch (e) {
      console.error(e);
      this.error = e?.message || __('Something went wrong', 'surecart');
    } finally {
      this.downloading = null;
    }
  }

  downloadFile(path, filename) {
    // Create a new link
    const anchor = document.createElement('a');
    anchor.href = path;
    anchor.download = filename;

    // Append to the DOM
    document.body.appendChild(anchor);

    // Trigger `click` event
    anchor.click();

    // To make this work on Firefox we need to wait
    // a little while before removing it.
    setTimeout(() => {
      document.body.removeChild(anchor);
    }, 0);
  }

  renderFileExt = download => {
    if (download?.media?.filename) {
      return download.media.filename.split?.('.')?.pop?.();
    }
    if (download?.url) {
      try {
        const url = new URL(download.url);
        if (url.pathname.includes('.')) {
          return url.pathname.split?.('.')?.pop?.();
        }
      } catch (err) {
        console.error(err);
      }
    }
    return <sc-icon name="file" />;
  };

  renderList() {
    if (this?.busy && !this?.downloads?.length) {
      return this.renderLoading();
    }
    if (!this?.downloads?.length) {
      return this.renderEmpty();
    }
    const downloads = this.downloads || [];
    
    return (
        <sc-card no-padding>
        <sc-stacked-list>
          {downloads.map(download => {
            const media = download?.media as Media;
            return (
              <sc-stacked-list-row style={{ '--columns': '1' }}>
                <sc-flex class="single-download" justifyContent="flex-start" alignItems="center">
                  <div class="single-download__preview">{this.renderFileExt(download)}</div>
                  <div>
                    <div>
                      <strong>{media?.filename ?? download?.name ?? ''}</strong>
                    </div>

                    <sc-flex justifyContent="flex-start" alignItems="center" style={{ gap: '0.5em' }}>
                      {media?.byte_size && <sc-format-bytes value={media.byte_size}></sc-format-bytes>}

                      {!!media?.release_json?.version && (
                        <sc-tag
                          type="primary"
                          size="small"
                          style={{
                            '--sc-tag-primary-background-color': '#f3e8ff',
                            '--sc-tag-primary-color': '#6b21a8',
                          }}
                        >
                          v{media?.release_json?.version}
                        </sc-tag>
                      )}
                    </sc-flex>
                  </div>
                </sc-flex>
                <sc-button
                  size="small"
                  slot="suffix"
                  onClick={() => this.downloadItem(download)}
                  busy={media?.id ? this.downloading == media?.id : false}
                  disabled={media?.id ? this.downloading == media?.id : false}
                >
                  {__('Download', 'surecart')}
                </sc-button>
              </sc-stacked-list-row>
            );
          })}
        </sc-stacked-list>
      </sc-card>
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

  render() {
    return (
      <sc-dashboard-module class="purchase" part="base" heading={__('Downloads', 'surecart')}>
        <span slot="heading">
          <slot name="heading">{this.heading || __('Downloads', 'surecart')}</slot>
        </span>
        {this.renderList()}
        <sc-pagination
          page={this.query.page}
          perPage={this.query.per_page}
          total={this.pagination.total}
          totalPages={this.pagination.total_pages}
          totalShowing={this?.downloads?.length}
          onScNextPage={() => this.nextPage()}
          onScPrevPage={() => this.prevPage()}
        ></sc-pagination>
         {this.busy && <sc-block-ui></sc-block-ui>}
      </sc-dashboard-module>
    );
  }
}
