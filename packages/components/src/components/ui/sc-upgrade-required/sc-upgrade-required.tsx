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
        <sc-tag type="success" size="medium" pill={false} onClick={() => (this.open = true)}>
          {__('Premium', 'surecart')}
        </sc-tag>
        <sc-dialog label="For upgrade click upgrade now." open={this.open}>
          <sc-button href="https://api.surecart.com/billing" type="primary">
            Upgrade Now!
          </sc-button>
        </sc-dialog>
      </Host>
    );
  }
}
