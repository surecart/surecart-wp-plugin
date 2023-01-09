import { Component, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';

@Component({
  tag: 'sc-premium-tag',
  shadow: true,
})
export class ScPremiumTag {
  /** The tag's size. */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'small';

  render() {
    return (
      <sc-tag type="success" size={this.size}>
        {__('Premium', 'surecart')}
      </sc-tag>
    );
  }
}
