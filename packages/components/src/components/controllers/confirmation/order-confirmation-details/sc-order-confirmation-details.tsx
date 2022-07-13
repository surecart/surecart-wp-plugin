import { Order } from '../../../../types';
import { Component, h, Prop } from '@stencil/core';
import { sprintf, __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';

@Component({
  tag: 'sc-order-confirmation-details',
  styleUrl: 'sc-order-confirmation-details.css',
  shadow: true,
})
export class ScOrderConfirmationDetails {
  @Prop() order: Order;

  renderOrderStatus() {
    if (this?.order?.status === 'requires_approval') {
      return <sc-tag type="warning">{__('On Hold', 'surecart')}</sc-tag>;
    }
    return <sc-order-status-badge status={this.order?.status}></sc-order-status-badge>;
  }

  render() {
    if (!this.order?.number) return;
    return (
      <sc-dashboard-module class="order">
        <span slot="heading">{sprintf(__('Order #%s', 'surecart'), this.order?.number)}</span>
        <span slot="end">{this.renderOrderStatus()}</span>
        <sc-card>
          <sc-order-confirmation-line-items></sc-order-confirmation-line-items>
          <sc-divider></sc-divider>
          <sc-order-confirmation-totals></sc-order-confirmation-totals>
        </sc-card>
      </sc-dashboard-module>
    );
  }
}
openWormhole(ScOrderConfirmationDetails, ['order', 'customer', 'loading'], false);
