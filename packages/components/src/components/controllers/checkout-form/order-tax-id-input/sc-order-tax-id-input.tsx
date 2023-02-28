import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';
import { Address, Checkout, TaxIdentifier, TaxProtocol } from '../../../../types';

@Component({
  tag: 'sc-order-tax-id-input',
  styleUrl: 'sc-order-tax-id-input.css',
  shadow: true,
})
export class ScOrderTaxIdInput {
  /** The order */
  @Prop() order: Partial<Checkout>;

  /** Force show the field. */
  @Prop() show: boolean = false;

  /** Tax identifier */
  @Prop() taxIdentifier: TaxIdentifier;

  /** The tax protocol. */
  @Prop() taxProtocol: TaxProtocol;

  /** Is this busy */
  @Prop() busy: boolean = false;

 /** Other zones label */
  @Prop() otherLabel:string;

  /** GST zone label */
  @Prop() caGstLabel:string;

  /** AU zone label */
  @Prop() auAbnLabel:string;

  /** UK zone label */
  @Prop() gbVatLabel:string;

   /** EU zone label */
  @Prop() euVatLabel:string;

  /** Make a request to update the order. */
  @Event() scUpdateOrder: EventEmitter<{
    data: Partial<Checkout>;
    options?: { silent?: boolean };
  }>;

  getStatus() {
    if (this.taxIdentifier?.number_type !== 'eu_vat') {
      return 'unknown';
    }
    if (this.taxProtocol?.eu_vat_unverified_behavior === 'apply_reverse_charge') {
      return 'unknown';
    }
    return this.taxIdentifier?.eu_vat_verified ? 'valid' : 'invalid';
  }

  maybeUpdateOrder(tax_identifier) {
    this.scUpdateOrder.emit({
      data: { tax_identifier },
    });
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
          this.maybeUpdateOrder(e.detail);
        }}
        otherLabel={this.otherLabel}
        caGstLabel={this.caGstLabel}
        auAbnLabel={this.auAbnLabel}
        gbVatLabel={this.gbVatLabel}
        euVatLabel={this.euVatLabel}
      ></sc-tax-id-input>
    );
  }
}

openWormhole(ScOrderTaxIdInput, ['draft', 'order', 'tax_status', 'taxIdentifier', 'taxProtocol', 'busy'], false);
