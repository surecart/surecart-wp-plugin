import { Component, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { SubscriptionStatus } from '../../../types';

@Component({
  tag: 'ce-subscription-status-badge',
  styleUrl: 'ce-subscription-status-badge.css',
  shadow: true,
})
export class CeSubscriptionStatusBadge {
  /** The tag's statux type. */
  @Prop() status: SubscriptionStatus;

  /** The tag's size. */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** Draws a pill-style tag with rounded edges. */
  @Prop({ reflect: true }) pill: boolean = false;

  /** Makes the tag clearable. */
  @Prop() clearable: boolean = false;

  getType() {
    switch (this.status) {
      case 'incomplete':
        return 'warning';
      case 'trialing':
        return 'text';
      case 'active':
        return 'success';
      case 'past_due':
        return 'warning';
      case 'canceled':
        return 'danger';
      case 'unpaid':
        return 'warning';
    }
  }

  getText() {
    switch (this.status) {
      case 'incomplete':
        return __('Incomplete', 'checkout_engine');
      case 'trialing':
        return __('Trialing', 'checkout_engine');
      case 'active':
        return __('Active', 'checkout_engine');
      case 'past_due':
        return __('Past Due', 'checkout_engine');
      case 'canceled':
        return __('Cancelled', 'checkout_engine');
      case 'unpaid':
        return __('Unpaid', 'checkout_engine');
    }
  }

  render() {
    return <ce-tag type={this.getType()}>{this.getText()}</ce-tag>;
  }
}
