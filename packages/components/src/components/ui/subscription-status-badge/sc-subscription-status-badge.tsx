import { Component, Fragment, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { Subscription, SubscriptionStatus } from '../../../types';

@Component({
  tag: 'sc-subscription-status-badge',
  styleUrl: 'sc-subscription-status-badge.css',
  shadow: true,
})
export class ScSubscriptionStatusBadge {
  /** Subscription status */
  @Prop() status: SubscriptionStatus;

  /** The tag's status type. */
  @Prop() subscription: Subscription;

  /** The tag's size. */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** Draws a pill-style tag with rounded edges. */
  @Prop({ reflect: true }) pill: boolean = false;

  /** Makes the tag clearable. */
  @Prop() clearable: boolean = false;

  getType() {
    if (this.subscription?.cancel_at_period_end) {
      return 'info';
    }
    switch (this.status || this.subscription?.status) {
      case 'incomplete':
        return 'warning';
      case 'trialing':
        return 'info';
      case 'active':
        return 'success';
      case 'completed':
        return 'success';
      case 'past_due':
        return 'warning';
      case 'canceled':
         if(this.subscription?.restore_at){
          return "info"
        }
        return 'danger';
      case 'unpaid':
        return 'warning';
    }
  }

  getText() {
    if (this.subscription?.cancel_at_period_end && this.subscription.current_period_end_at) {
      return (
        <Fragment>
          {__('Cancels', 'surecart')} <sc-format-date type="timestamp" date={this.subscription.current_period_end_at} month="short" day="numeric"></sc-format-date>
        </Fragment>
      );
    }
    switch (this.status || this.subscription?.status) {
      case 'incomplete':
        return __('Incomplete', 'surecart');
      case 'trialing':
        return __('Trialing', 'surecart');
      case 'active':
        return __('Active', 'surecart');
      case 'past_due':
        return __('Past Due', 'surecart');
      case 'canceled':
        if(this.subscription?.restore_at){
          return "Paused"
        }
        return __('Canceled', 'surecart');
      case 'completed':
        return __('Completed', 'surecart');
      case 'unpaid':
        return __('Unpaid', 'surecart');
    }
  }

  render() {
    return <sc-tag type={this.getType()}>{this.getText()}</sc-tag>;
  }
}
