import { Component, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';

import { FulfillmentStatus } from '../../../types';

const status = {
  unshipped: __('Not Shipped', 'surecart'),
  shipped: __('Shipped', 'surecart'),
  delivered: __('Delivered', 'surecart'),
} as {
  [key in FulfillmentStatus]: string;
};

const type = {
  unshipped: 'default',
  shipped: 'success',
  delivered: 'info',
} as {
  [key in FulfillmentStatus]: 'default' | 'info' | 'success';
};

@Component({
  tag: 'sc-fulfillment-shipping-status-badge',
  styleUrl: 'sc-fulfillment-shipping-status-badge.css',
  shadow: true,
})
export class ScOrderStatusBadge {
  /** The tag's statux type. */
  @Prop() status: FulfillmentStatus;

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
