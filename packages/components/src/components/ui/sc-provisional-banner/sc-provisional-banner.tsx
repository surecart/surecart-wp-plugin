import { Component, Prop, h } from '@stencil/core';

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
          Complete your store setup to go live.
          <a href={this.claimUrl}>
            Complete Setup <sc-icon name="arrow-right"></sc-icon>
          </a>
        </p>
      </div>
    );
  }
}
