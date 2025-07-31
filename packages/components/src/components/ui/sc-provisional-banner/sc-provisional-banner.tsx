import { Component, Prop, h } from '@stencil/core';
import { __ } from '@wordpress/i18n';

@Component({
  tag: 'sc-provisional-banner',
  styleUrl: 'sc-provisional-banner.scss',
  shadow: true,
})
export class ScProvisionalBanner {
  /** Claim URL. */
  @Prop() claimUrl: string = '';

  render() {
    return (
      <div class={{ 'sc-banner': true }}>
        <p>
          {__('Complete your store setup to go live.', 'surecart')}
          <a href={this.claimUrl} target="_blank" rel="noopener noreferrer">
            {__('Complete Setup', 'surecart')} <sc-icon name="arrow-right"></sc-icon>
          </a>
        </p>
      </div>
    );
  }
}
