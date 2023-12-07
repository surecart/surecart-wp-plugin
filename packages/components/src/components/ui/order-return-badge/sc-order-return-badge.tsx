/**
 * External dependencies.
 */
import { Component, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { ReturnRequestStatus } from '../../../types';

const status = {
  open: __('Return in progress', 'surecart'),
  completed: __('Returned', 'surecart'),
} as {
  [key in ReturnRequestStatus]: string;
};

const type = {
  open: 'warning',
  completed: 'success',
} as {
  [key in ReturnRequestStatus]: 'warning' | 'success';
};

@Component({
  tag: 'sc-order-return-badge',
  styleUrl: 'sc-order-return-badge.css',
  shadow: true,
})
export class ScOrderReturnBadge {
  /** The tag's statux type. */
  @Prop() status: ReturnRequestStatus;

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
