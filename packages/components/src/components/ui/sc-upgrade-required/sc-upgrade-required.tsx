import { Component, h, Host, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';

@Component({
  tag: 'sc-upgrade-required',
  styleUrl: 'sc-upgrade-required.css',
  shadow: true,
})
export class ScUpgradeRequired {
  @State() open: boolean = false;

  render() {
    return (
      <Host>
        <sc-tag type="success" size="medium" onClick={() => (this.open = true)}>
          {__('Premium', 'surecart')}
        </sc-tag>
        <sc-dialog label={__('Boost your revenue', 'surecart')} open={this.open} onScRequestClose={() => (this.open = false)}>
          <p>{__('Unlock revenue boosting features when you upgrade your plan!', 'surecart')}</p>
          <sc-button href="https://api.surecart.com/billing" type="primary" target="_blank">
            {__('Upgrade Now!', 'surecart')}
          </sc-button>
        </sc-dialog>
      </Host>
    );
  }
}
