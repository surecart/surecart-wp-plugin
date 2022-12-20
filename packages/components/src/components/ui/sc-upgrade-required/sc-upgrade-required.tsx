import { Component, h, Host, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';

@Component({
  tag: 'sc-upgrade-required',
  styleUrl: 'sc-upgrade-required.scss',
  shadow: true,
})
export class ScUpgradeRequired {
  /** The tag's size. */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'small';

  @State() open: boolean = false;

  render() {
    return (
      <Host>
        <sc-tag type="success" size={this.size} onClick={() => (this.open = true)}>
          {__('Premium', 'surecart')}
        </sc-tag>
        <sc-dialog
          label={__('Boost Your Revenue', 'surecart')}
          open={this.open}
          onScRequestClose={() => (this.open = false)}
          style={{ '--width': '21rem', 'fontSize': '15px', '--body-spacing': '2rem' }}
        >
          <span class="dialog__title" slot="label">
            <sc-icon name="zap"></sc-icon>
            <span>{__('Boost Your Revenue', 'surecart')}</span>
          </span>
          <p>{__('Unlock revenue boosting features when you upgrade your plan!', 'surecart')}</p>
          <sc-button href="https://api.surecart.com/billing" type="primary" target="_blank" full>
            {__('Upgrade Now!', 'surecart')}
          </sc-button>
        </sc-dialog>
      </Host>
    );
  }
}
