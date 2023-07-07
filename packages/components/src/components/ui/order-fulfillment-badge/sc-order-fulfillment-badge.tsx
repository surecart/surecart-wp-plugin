import { Component, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';

import { OrderFulFillmentStatus } from '../../../types';

const status = {
  unfulfilled: __('Unfulfilled', 'surecart'),
  fulfilled: __('Fulfilled', 'surecart'),
  on_hold: __('On Hold', 'surecart'),
  scheduled: __('Scheduled', 'surecart'),
  partially_fulfilled: __('Partially Fulfilled', 'surecart'),
} as {
  [key in OrderFulFillmentStatus]: string;
};

const type = {
  unfulfilled: 'warning',
  fulfilled: 'success',
  on_hold: 'warning',
  scheduled: 'default',
  partially_fulfilled: 'warning',
} as {
  [key in OrderFulFillmentStatus]: 'default' | 'success' | 'warning' | 'danger';
};

@Component({
  tag: 'sc-order-fulfillment-badge',
  styleUrl: 'sc-order-fulfillment-badge.css',
  shadow: true,
})
export class ScOrderFulFillmentBadge {
  /** The tag's statux type. */
  @Prop() status: OrderFulFillmentStatus;

  /** The tag's size. */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** Draws a pill-style tag with rounded edges. */
  @Prop({ reflect: true }) pill: boolean = false;

  /** Makes the tag clearable. */
  @Prop() clearable: boolean = false;

  render() {
    return (
      <sc-tag type={type?.[this?.status]} pill={this.pill}>
        {status?.[this.status] || this.status}
      </sc-tag>
    );
  }
}
