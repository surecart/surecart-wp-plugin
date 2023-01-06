import { Component, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';

import { OrderStatus } from '../../../types';

@Component({
  tag: 'sc-order-status-badge',
  styleUrl: 'sc-order-status-badge.css',
  shadow: true,
})
export class ScOrderStatusBadge {
  /** The tag's statux type. */
  @Prop() status: OrderStatus;

  /** The tag's size. */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** Draws a pill-style tag with rounded edges. */
  @Prop({ reflect: true }) pill: boolean = false;

  /** Makes the tag clearable. */
  @Prop() clearable: boolean = false;

  getType() {
    switch (this.status) {
      case 'processing':
        return 'warning';
      case 'paid':
        return 'success';
      case 'payment_failed':
        return 'danger';
      case 'canceled':
        return 'danger';
      case 'void':
        return 'default';
    }
  }

  getText() {
    switch (this.status) {
      case 'processing':
        return __('Processing', 'surecart');
      case 'payment_failed':
        return __('Payment Failed', 'surecart');
      case 'paid':
        return __('Paid', 'surecart');
      case 'canceled':
        return __('Canceled', 'surecart');
      case 'void':
        return __('Void', 'surecart');
      default:
        return this.status;
    }
  }

  render() {
    return <sc-tag type={this.getType()}>{this.getText()}</sc-tag>;
  }
}
