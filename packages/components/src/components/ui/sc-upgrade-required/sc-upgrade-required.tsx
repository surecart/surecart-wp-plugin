import { Component, h } from '@stencil/core';
import { __ } from '@wordpress/i18n';

@Component({
  tag: 'sc-upgrade-required',
  styleUrl: 'sc-upgrade-required.css',
  shadow: true,
})
export class ScUpgradeRequired {
  render() {
    return (
      <sc-tag type="success" size="medium" pill={false}>
        {__('Premium', 'surecart')}
      </sc-tag>
    );
  }
}
