import { Component, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { OrderStatus } from '../../../types';

@Component({
  tag: 'ce-order-status-badge',
  styleUrl: 'ce-order-status-badge.css',
  shadow: true,
})
export class CeOrderStatusBadge {
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
      case 'finalized':
        return 'warning';
      case 'completed':
      case 'paid':
        return 'success';
    }
  }

  getText() {
    switch (this.status) {
      case 'draft':
        return __('Draft', 'checkout_engine');
      case 'finalized':
        return __('Pending Payment', 'checkout_engine');
      case 'paid':
        return __('Paid', 'checkout_engine');
      case 'completed':
        return __('Completed', 'checkout_engine');
      default:
        return this.status;
    }
  }

  render() {
    return <ce-tag type={this.getType()}>{this.getText()}</ce-tag>;
  }
}
