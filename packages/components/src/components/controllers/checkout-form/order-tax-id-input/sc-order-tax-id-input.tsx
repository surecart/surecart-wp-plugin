import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';
import { Address, Order } from '../../../../types';

@Component({
  tag: 'sc-order-tax-id-input',
  styleUrl: 'sc-order-tax-id-input.css',
  shadow: false,
})
export class ScOrderTaxIdInput {
  /** The order */
  @Prop() order: Partial<Order>;

  /** Force show the field. */
  @Prop() show: boolean = false;

  /** Make a request to update the order. */
  @Event() scUpdateOrder: EventEmitter<Partial<Order>>;

  render() {
    if (this.order?.tax_identifier?.number && this.order?.tax_identifier?.number_type) {
      return (
        <sc-tax-id-input
          show={this.show}
          number={this.order?.tax_identifier?.number}
          type={this.order?.tax_identifier?.number_type}
          onScChange={e => {
            const tax_identifier = e.detail;
            this.scUpdateOrder.emit({
              tax_identifier,
            });
          }}
        ></sc-tax-id-input>
      );
    }

    return (
      <sc-tax-id-input
        show={this.show}
        number={this.order?.tax_identifier?.number}
        type={this.order?.tax_identifier?.number_type}
        country={(this?.order?.shipping_address as Address)?.country}
        onScChange={e => {
          const tax_identifier = e.detail;
          this.scUpdateOrder.emit({
            tax_identifier,
          });
        }}
      ></sc-tax-id-input>
    );
  }
}

openWormhole(ScOrderTaxIdInput, ['draft', 'order', 'tax_status'], false);
