import { Component, h, Host, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';

import { OrderShipmentStatus } from '../../../types';

const status = {
  unshipped: __('Not Shipped', 'surecart'),
  shipped: __('Shipped', 'surecart'),
  partially_shipped: __('Partially Shipped', 'surecart'),
  delivered: __('Delivered', 'surecart'),
} as {
  [key in OrderShipmentStatus]: string;
};

const type = {
  unshipped: 'default',
  shipped: 'info',
  partially_shipped: 'warning',
  delivered: 'success',
} as {
  [key in OrderShipmentStatus]: 'default' | 'success' | 'warning' | 'danger' | 'info';
};

@Component({
  tag: 'sc-order-shipment-badge',
  styleUrl: 'sc-order-shipment-badge.css',
  shadow: true,
})
export class ScOrderShipmentBadge {
  /** The tag's statux type. */
  @Prop() status: OrderShipmentStatus;

  /** The tag's size. */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** Draws a pill-style tag with rounded edges. */
  @Prop({ reflect: true }) pill: boolean = false;

  /** Makes the tag clearable. */
  @Prop() clearable: boolean = false;

  render() {
    // don't render if not shippable.
    if (this.status === 'not_shippable') {
      return <Host style={{ display: 'none' }}></Host>;
    }

    return (
      <sc-tag type={type?.[this?.status]} pill={this.pill}>
        {status?.[this.status] || this.status}
      </sc-tag>
    );
  }
}
