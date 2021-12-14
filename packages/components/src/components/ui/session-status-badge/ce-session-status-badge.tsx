import { Component, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { SessionStatus } from '../../../types';

@Component({
  tag: 'ce-session-status-badge',
  styleUrl: 'ce-session-status-badge.css',
  shadow: true,
})
export class CeSessionStatusBadge {
  /** The tag's statux type. */
  @Prop() status: SessionStatus;

  /** The tag's size. */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** Draws a pill-style tag with rounded edges. */
  @Prop({ reflect: true }) pill: boolean = false;

  /** Makes the tag clearable. */
  @Prop() clearable: boolean = false;

  getType() {
    switch (this.status) {
      case 'draft':
        return 'text';
      case 'finalized':
        return 'warning';
      case 'completed':
        return 'success';
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
      case 'completed':
        return __('Completed', 'checkout_engine');
      case 'paid':
        return __('Paid', 'checkout_engine');
    }
  }

  render() {
    return <ce-tag type={this.getType()}>{this.getText()}</ce-tag>;
  }
}
