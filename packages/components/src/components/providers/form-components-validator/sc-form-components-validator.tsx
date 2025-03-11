import { Component, Element, h, Prop, State, Watch } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { state as checkoutState, onChange as onCheckoutChange } from '@store/checkout';
import { TaxProtocol } from '../../../types';
import { shippingAddressRequired } from '@store/checkout/getters';

@Component({
  tag: 'sc-form-components-validator',
  shadow: true,
})
export class ScFormComponentsValidator {
  @Element() el: HTMLScFormComponentsValidatorElement;

  private removeCheckoutListener: () => void;
  private removePaymentRequiresShippingListener: () => void;

  /** Disable validation? */
  @Prop() disabled: boolean;

  /** The tax protocol */
  @Prop() taxProtocol: TaxProtocol;

  /** Is there an address field? */
  @State() hasAddress: boolean;

  /** Is there a tax id field? */
  @State() hasTaxIDField: boolean;

  /** Is there a bumps field? */
  @State() hasBumpsField: boolean;

  /** Is there a tax line? */
  @State() hasTaxLine: boolean;

  /** Is there a bump line? */
  @State() hasBumpLine: boolean;

  /** Is there shipping choices */
  @State() hasShippingChoices: boolean;

  /** Is there a shipping amount */
  @State() hasShippingAmount: boolean;

  /** Is there an invoice details */
  @State() hasInvoiceDetails: boolean;

  /** Is there an invoice memo */
  @State() hasInvoiceMemo: boolean;

  /** Is there a trial line item */
  @State() hasTrialLineItem: boolean;

  handleOrderChange() {
    // bail if we don't have address invalid error or disabled.
    if (this.disabled) return;

    // make sure to add the address field if it's not there.
    if (shippingAddressRequired()) {
      this.addAddressField();
    }

    // add order bumps.
    if (checkoutState.checkout?.recommended_bumps?.data?.length) {
      this.addBumps();
    }
    if (!!checkoutState.checkout?.tax_amount) {
      this.addTaxLine();
    }

    // add shipping choices.
    if (checkoutState.checkout?.shipping_enabled && checkoutState.checkout?.selected_shipping_choice_required) {
      this.addShippingChoices();
    }

    if (!!checkoutState.checkout?.shipping_amount) {
      this.addShippingAmount();
    }

    // automatically add invoice details if we have an invoice.
    if (!!checkoutState.checkout?.invoice) {
      this.addInvoiceDetails();
      this.addInvoiceMemo();
    }

    // automatically add trial line item if we have a trial amount.
    if (!!checkoutState.checkout?.trial_amount) {
      this.addTrialLineItem();
    }
  }

  @Watch('hasAddress')
  handleHasAddressChange() {
    if (!this.hasAddress) return;
    this.handleShippingAddressRequired();
  }

  componentWillLoad() {
    this.hasAddress = !!this.el.querySelector('sc-order-shipping-address');
    this.hasTaxIDField = !!this.el.querySelector('sc-order-tax-id-input');
    this.hasBumpsField = !!this.el.querySelector('sc-order-bumps');
    this.hasTaxLine = !!this.el.querySelector('sc-line-item-tax');
    this.hasShippingChoices = !!this.el.querySelector('sc-shipping-choices');
    this.hasShippingAmount = !!this.el.querySelector('sc-line-item-shipping');
    this.hasInvoiceDetails = !!this.el.querySelector('sc-invoice-details');
    this.hasInvoiceMemo = !!this.el.querySelector('sc-invoice-memo');
    this.hasTrialLineItem = !!this.el.querySelector('sc-line-item-trial');

    // if eu vat is required, add the tax id field.
    if (this.taxProtocol?.tax_enabled && this.taxProtocol?.eu_vat_required) {
      this.addTaxIDField();
    }

    this.handleOrderChange();

    this.removeCheckoutListener = onCheckoutChange('checkout', () => this.handleOrderChange());
    this.removePaymentRequiresShippingListener = onCheckoutChange('paymentMethodRequiresShipping', () => this.handleOrderChange());
  }

  disconnectedCallback() {
    this.removeCheckoutListener();
    this.removePaymentRequiresShippingListener();
  }

  handleShippingAddressRequired() {
    if (!checkoutState.checkout?.shipping_address_required) return;

    // get the address
    const address = this.el.querySelector('sc-order-shipping-address');
    if (!address) return;

    // require the address.
    address.required = true;

    // if we have a customer name field, require that.
    const customerName = this.el.querySelector('sc-customer-name');
    if (!!customerName) {
      customerName.required = true;
      return;
    }

    // if we have a customer first name field, require that.
    const customerFirstName = this.el.querySelector('sc-customer-firstname');
    const customerLastName = this.el.querySelector('sc-customer-lastname');

    // if we have a customer first name field, require that.
    if (!!customerFirstName) {
      customerFirstName.required = true;

      // if we have a customer last name field, require that.
      if (!!customerLastName) {
        customerLastName.required = true;
      }

      return; // we're done here.
    }

    // require the name and show the name input.
    address.requireName = true;
    address.showName = true;
  }

  addAddressField() {
    if (this.hasAddress) {
      return;
    }

    const payment = this.el.querySelector('sc-payment');
    const shippingAddress = document.createElement('sc-order-shipping-address');
    shippingAddress.label = __('Shipping Address', 'surecart');
    const billingAddress = document.createElement('sc-order-billing-address');
    billingAddress.label = __('Billing Address', 'surecart');
    payment.parentNode.insertBefore(shippingAddress, payment);
    payment.parentNode.insertBefore(billingAddress, payment);
    this.hasAddress = true;
  }

  addTaxIDField() {
    if (this.hasTaxIDField) return;
    const payment = this.el.querySelector('sc-payment');
    const taxInput = document.createElement('sc-order-tax-id-input');
    payment.parentNode.insertBefore(taxInput, payment);
    this.hasTaxIDField = true;
  }

  addBumps() {
    if (this.hasBumpsField) return;
    const attachReferenceElement = this.el.querySelector('sc-order-billing-address') || this.el.querySelector('sc-payment');
    const bumps = document.createElement('sc-order-bumps');
    attachReferenceElement?.parentNode.insertBefore(bumps, attachReferenceElement.nextSibling);
    this.hasBumpsField = true;
  }

  addTaxLine() {
    if (this.hasTaxLine) return;
    const total = this.el.querySelector('sc-line-item-total[total=total]');
    const tax = document.createElement('sc-line-item-tax');

    if (!total) return;

    if (total?.previousElementSibling?.tagName === 'SC-DIVIDER') {
      total.parentNode.insertBefore(tax, total.previousElementSibling);
    } else {
      total.parentNode.insertBefore(tax, total);
    }
    this.hasTaxLine = true;
  }

  addShippingChoices() {
    if (this.hasShippingChoices) return;

    const payment = this.el.querySelector('sc-payment');
    const shippingChoices = document.createElement('sc-shipping-choices');
    payment.parentNode.insertBefore(shippingChoices, payment);
    this.hasShippingChoices = true;
  }

  addShippingAmount() {
    if (this.hasShippingAmount) return;

    let insertBeforeElement: Element = this.el.querySelector('sc-line-item-tax');
    const total = this.el.querySelector('sc-line-item-total[total=total]');

    if (!total) return;

    if (!insertBeforeElement) {
      insertBeforeElement = total?.previousElementSibling?.tagName === 'SC-DIVIDER' ? total.previousElementSibling : total;
    }

    const shippingAmount = document.createElement('sc-line-item-shipping');
    insertBeforeElement.parentNode.insertBefore(shippingAmount, insertBeforeElement);
    this.hasShippingAmount = true;
  }

  addInvoiceDetails() {
    if (this.hasInvoiceDetails) return;

    let lineItems: Element = this.el.querySelector('sc-line-items');
    const invoiceDetails = document.createElement('sc-invoice-details');
    lineItems.parentNode.insertBefore(invoiceDetails, lineItems);

    // Add sc-line-item-invoice-number inside sc-invoice-details.
    const invoiceNumber = document.createElement('sc-line-item-invoice-number');
    invoiceDetails.appendChild(invoiceNumber);

    // Add sc-line-item-invoice-due-date inside sc-invoice-details.
    const invoiceDueDate = document.createElement('sc-line-item-invoice-due-date');
    invoiceDetails.appendChild(invoiceDueDate);

    // Add invoice sc-line-item-invoice-receipt-download inside sc-invoice-details.
    const invoiceReceiptDownload = document.createElement('sc-line-item-invoice-receipt-download');
    invoiceDetails.appendChild(invoiceReceiptDownload);

    // Add sc-divider inside sc-invoice-details.
    const divider = document.createElement('sc-divider');
    invoiceDetails.appendChild(divider);

    this.hasInvoiceDetails = true;
  }

  addInvoiceMemo() {
    if (this.hasInvoiceMemo) return;

    const orderSummary = this.el.querySelector('sc-order-summary');

    const invoiceDetails = document.createElement('sc-invoice-details');

    // Add sc-divider inside sc-invoice-details.
    orderSummary.parentNode.insertBefore(invoiceDetails, orderSummary.nextSibling);

    // Add sc-invoice-memo inside sc-invoice-details.
    const invoiceMemo = document.createElement('sc-invoice-memo');
    invoiceDetails.appendChild(invoiceMemo);

    this.hasInvoiceMemo = true;
  }

  addTrialLineItem() {
    if (this.hasTrialLineItem) return;

    const subtotal = this.el.querySelector('sc-line-item-total[total=subtotal]');
    const trialItem = document.createElement('sc-line-item-trial');

    if (!subtotal) return;

    // Insert the trial item before the coupon form.
    subtotal.parentNode.insertBefore(trialItem, subtotal.nextSibling);

    this.hasTrialLineItem = true;
  }

  render() {
    return <slot />;
  }
}
