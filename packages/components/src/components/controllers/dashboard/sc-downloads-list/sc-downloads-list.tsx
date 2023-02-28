import { Component, h, Prop, State } from '@stencil/core';
import apiFetch from '../../../../functions/fetch';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

import { Download, Media } from '../../../../types';

@Component({
  tag: 'sc-downloads-list',
  styleUrl: 'sc-downloads-list.scss',
  shadow: true,
})
export class ScDownloadsList {
  @Prop() downloads: Download[];
  @Prop() customerId: string;
  @Prop() heading: string;
  @State() busy: string;
  @State() error: string;

  async downloadItem(download) {
    if (download?.url) {
      this.downloadFile(download.url, download?.name ?? 'file');
      return;
    }

    const mediaId = download?.media?.id;
    if (!mediaId) return;

    try {
      this.busy = mediaId;
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
      this.busy = null;
    }
  }

  downloadFile(path, filename) {
    // Create a new link
    const anchor = document.createElement('a');
    anchor.href = path;
    anchor.download = filename;
    anchor.target = '_blank';

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

  render() {
    const downloads = this.downloads || [];
    return (
      <sc-dashboard-module class="purchase" part="base" heading={__('Downloads', 'surecart')}>
        <span slot="heading">
          <slot name="heading">{this.heading || __('Downloads', 'surecart')}</slot>
        </span>
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
                    busy={media?.id ? this.busy == media?.id : false}
                    disabled={media?.id ? this.busy == media?.id : false}
                  >
                    {__('Download', 'surecart')}
                  </sc-button>
                </sc-stacked-list-row>
              );
            })}
          </sc-stacked-list>
        </sc-card>
      </sc-dashboard-module>
    );
  }
}
