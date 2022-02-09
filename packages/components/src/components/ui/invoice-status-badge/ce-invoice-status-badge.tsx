import { Component, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { Invoice } from '../../../types';

@Component({
  tag: 'ce-invoice-status-badge',
  styleUrl: 'ce-invoice-status-badge.css',
  shadow: true,
})
export class CeInvoiceStatusBadge {
  /** The tag's statux type. */
  @Prop() invoice: Invoice;

  /** The tag's size. */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** Draws a pill-style tag with rounded edges. */
  @Prop({ reflect: true }) pill: boolean = false;

  /** Makes the tag clearable. */
  @Prop() clearable: boolean = false;

  getType() {
    switch (this.invoice?.status) {
      case 'draft':
        return 'info';
      case 'finalized':
        return 'warning';
      case 'paid':
        return 'success';
      case 'payment_intent_canceled':
        return 'danger';
      case 'payment_failed':
        return 'danger';
    }
  }

  getText() {
    switch (this.invoice?.status) {
      case 'draft':
        return __('Draft', 'checkout_engine');
      case 'finalized':
        return __('Finalized', 'checkout_engine');
      case 'paid':
        return __('Paid', 'checkout_engine');
      case 'payment_intent_canceled':
        return __('Payment Canceled', 'checkout_engine');
      case 'payment_failed':
        return __('Payment Failed', 'checkout_engine');
    }
  }

  render() {
    return <ce-tag type={this.getType()}>{this.getText()}</ce-tag>;
  }
}
