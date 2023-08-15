import { Component, Prop, h } from '@stencil/core';
import { __ } from '@wordpress/i18n';

@Component({
  tag: 'sc-feature-demo-banner',
  styleUrl: 'sc-feature-demo-banner.scss',
  shadow: true,
})
export class ScFeatureDemoBanner {
  @Prop() url: string = 'https://app.surecart.com/billing';
  @Prop() buttonText: string = __('Upgrade Your Plan', 'surecart');

  render() {
    return (
      <div class={{ 'sc-banner': true }}>
        <p>
          <slot>{__('This is a feature demo. In order to use it, you must upgrade your plan.', 'surecart')}</slot>
          <a href={this.url} target="_blank">
            <slot name="link">
              {this.buttonText} <sc-icon name="arrow-right"></sc-icon>
            </slot>
          </a>
        </p>
      </div>
    );
  }
}
