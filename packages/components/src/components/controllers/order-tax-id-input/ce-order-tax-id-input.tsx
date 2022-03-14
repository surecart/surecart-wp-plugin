import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';
import { Address, Order } from '../../../types';

@Component({
  tag: 'ce-order-tax-id-input',
  styleUrl: 'ce-order-tax-id-input.css',
  shadow: false,
})
export class CeOrderTaxIdInput {
  /** The order */
  @Prop() order: Order;

  /** Force show the field. */
  @Prop() show: boolean = false;

  /** Make a request to update the order. */
  @Event() ceUpdateOrder: EventEmitter<Partial<Order>>;

  render() {
    return (
      <ce-tax-id-input
        show={this.show}
        number={this.order.tax_identifier?.number}
        type={this.order.tax_identifier?.number_type}
        country={(this?.order?.shipping_address as Address)?.country}
        onCeChange={e => {
          const tax_identifier = e.detail;
          this.ceUpdateOrder.emit({
            tax_identifier,
          });
        }}
      ></ce-tax-id-input>
    );
  }
}

openWormhole(CeOrderTaxIdInput, ['draft', 'order', 'tax_status'], false);
