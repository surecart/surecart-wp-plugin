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
      case 'draft':
        return 'info';
      case 'requires_approval':
      case 'finalized':
        return 'warning';
      case 'paid':
        return 'success';
      case 'payment_intent_canceled':
      case 'payment_failed':
        return 'danger';
    }
  }

  getText() {
    switch (this.status) {
      case 'draft':
        return __('Draft', 'surecart');
      case 'finalized':
        return __('Pending Payment', 'surecart');
      case 'paid':
        return __('Paid', 'surecart');
      case 'payment_intent_canceled':
        return __('Cancelled', 'surecart');
      case 'payment_failed':
        return __('Failed', 'surecart');
      case 'requires_approval':
        return __('Requires Approval', 'surecart');
      default:
        return this.status;
    }
  }

  render() {
    return <sc-tag type={this.getType()}>{this.getText()}</sc-tag>;
  }
}
