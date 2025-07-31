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

  /** Whether the claim window has expired. */
  @Prop() expired: boolean = false;

  render() {
    return (
      <div class={{ 'sc-banner': true }}>
        <p>
          {this.expired
            ? __('The claim window for this account has expired.', 'surecart')
            : __('Complete your store setup to go live.', 'surecart')}
          {!this.expired && (
            <a href={this.claimUrl} target="_blank" rel="noopener noreferrer">
              {__('Complete Setup', 'surecart')} <sc-icon name="arrow-right"></sc-icon>
            </a>
          )}
        </p>
      </div>
    );
  }
}
