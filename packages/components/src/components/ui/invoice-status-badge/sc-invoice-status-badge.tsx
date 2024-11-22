/**
 * External dependencies.
 */
import { Component, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { InvoiceStatus } from '../../../types';

@Component({
  tag: 'sc-invoice-status-badge',
  styleUrl: 'sc-invoice-status-badge.css',
  shadow: true,
})
export class ScInvoiceStatusBadge {
  /** The tag's statux type. */
  @Prop() status: InvoiceStatus;

  /** The tag's size. */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** Draws a pill-style tag with rounded edges. */
  @Prop({ reflect: true }) pill: boolean = false;

  /** Makes the tag clearable. */
  @Prop() clearable: boolean = false;

  getType() {
    switch (this.status) {
      case 'paid':
        return 'success';
      case 'open':
        return 'info';
      case 'draft':
        return 'default';
    }
  }

  getText() {
    switch (this.status) {
      case 'paid':
        return __('Paid', 'surecart');
      case 'open':
        return __('Open', 'surecart');
      case 'draft':
        return __('Draft', 'surecart');
      default:
        return this.status;
    }
  }

  render() {
    return (
      <sc-tag type={this.getType()} pill={this.pill}>
        {this.getText()}
      </sc-tag>
    );
  }
}
