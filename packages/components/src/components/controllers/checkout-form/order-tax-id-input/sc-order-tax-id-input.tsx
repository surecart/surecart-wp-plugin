import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';
import { Address, Order, TaxIdentifier } from '../../../../types';

@Component({
  tag: 'sc-order-tax-id-input',
  styleUrl: 'sc-order-tax-id-input.css',
  shadow: true,
})
export class ScOrderTaxIdInput {
  /** The order */
  @Prop() order: Partial<Order>;

  /** Force show the field. */
  @Prop() show: boolean = false;

  @Prop() taxIdentifier: TaxIdentifier;

  /** Is this busy */
  @Prop() busy: boolean = false;

  /** Make a request to update the order. */
  @Event() scUpdateOrder: EventEmitter<{
    data: Partial<Order>;
    options?: { silent?: boolean };
  }>;

  getStatus() {
    if (this.taxIdentifier?.number_type !== 'eu_vat') {
      return 'unknown';
    }
    return this.taxIdentifier?.valid_eu_vat ? 'valid' : 'invalid';
  }

  render() {
    return (
      <sc-tax-id-input
        show={this.show}
        number={this.order?.tax_identifier?.number}
        type={this.order?.tax_identifier?.number_type}
        country={(this?.order?.shipping_address as Address)?.country}
        status={this.getStatus()}
        loading={this.busy}
        onScChange={e => {
          e.stopImmediatePropagation();
          const tax_identifier = e.detail;
          this.scUpdateOrder.emit({
            data: { tax_identifier },
          });
        }}
      ></sc-tax-id-input>
    );
  }
}

openWormhole(ScOrderTaxIdInput, ['draft', 'order', 'tax_status', 'taxIdentifier', 'busy'], false);
