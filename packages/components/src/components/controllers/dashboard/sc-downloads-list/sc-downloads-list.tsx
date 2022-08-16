import { Component, h, Prop, State } from '@stencil/core';
import apiFetch from '@wordpress/api-fetch';
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
  @State() busy: boolean;
  @State() error: string;

  async downloadItem(id) {
		try {
      this.busy = true;
			const media = await apiFetch({
				path: addQueryArgs(`surecart/v1/customers/${this.customerId}/expose/${id}`, {
          expose_for: 60,
        }),
			}) as Media;
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
			this.busy = false;
		}
	};

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
              return <sc-stacked-list-row style={{ '--columns': '1' }}>
                <sc-flex class="single-download" justifyContent='flex-start'>
                  <div class="single-download__preview">
                    {media?.filename?.split?.('.')?.pop?.()}
                  </div>
                  <div>
                    <div>
                      <strong>{media.filename}</strong>
                    </div>

                    <sc-flex justifyContent='flex-start' alignItems='center' style={{'gap': '0.5em'}}>
                      <sc-format-bytes value={media?.byte_size}></sc-format-bytes>

                      {!!media?.release_json?.version && (
                        <sc-tag
                          type="primary"
                          size="small"
                          style={{
                            '--sc-tag-primary-background-color':
                              '#f3e8ff',
                            '--sc-tag-primary-color': '#6b21a8',
                          }}
                        >
                          v{media?.release_json?.version}
                        </sc-tag>
                      )}
                    </sc-flex>
                  </div>
                </sc-flex>
                <sc-button size="small" slot="suffix" onClick={() => this.downloadItem(media.id)} busy={this.busy} disabled={this.busy}>{__('Download', 'surecart')}</sc-button>
              </sc-stacked-list-row>
            })}
          </sc-stacked-list>
        </sc-card>
      </sc-dashboard-module>
    );
  }
}
