import { Component, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';

@Component({
  tag: 'sc-upgrade-required',
  styleUrl: 'sc-upgrade-required.css',
  shadow: true,
})
export class ScUpgradeRequired {
  /** The tag's type. */
  @Prop({ reflect: true }) type: 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'default' = 'default';

  /** The tag's size. */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** Draws a pill-style tag with rounded edges. */
  @Prop({ reflect: true }) pill: boolean = false;

  render() {
    return (
      <sc-tag type={this.type ?? 'default'} size={this.size ?? 'medium'} pill={this.pill ?? false}>
        {__('Upgrade Required', 'surecart')}
      </sc-tag>
    );
  }
}
