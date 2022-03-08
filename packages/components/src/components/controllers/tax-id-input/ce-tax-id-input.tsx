import { Component, h, Prop, Fragment, Watch, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';
import { Address, Order, TaxStatus } from '../../../types';

@Component({
  tag: 'ce-tax-id-input',
  styleUrl: 'ce-tax-id-input.css',
  shadow: false,
})
export class CeTaxIdInput {
  @Prop() draft: { shipping_country: string } = { shipping_country: '' };
  @Prop() order: Order;
  @Prop() tax_status: TaxStatus;

  /** Force show the field. */
  @Prop() show: boolean = false;

  @State() type: string = null;

  private zones = {
    ca_gst: {
      label: __('GST Number', 'checkout-engine'),
      label_small: __('CA GST', 'checkout_engine'),
    },
    au_abn: {
      label: __('ABN Number', 'checkout-engine'),
      label_small: __('AU ABN', 'checkout_engine'),
    },
    gb_vat: {
      label: __('VAT Number', 'checkout_engine'),
      label_small: __('UK VAT', 'checkout_engine'),
    },
    eu_vat: {
      label: __('VAT Number', 'checkout_engine'),
      label_small: __('EU VAT', 'checkout_engine'),
    },
    other: {
      label: __('Tax ID', 'checkout-engine'),
      label_small: __('Other', 'checkout_engine'),
    },
  };

  @Watch('draft')
  handleDraftChange() {
    if (this?.draft?.shipping_country) {
      this.setType(this?.draft?.shipping_country);
    }
  }

  @Watch('type')
  handleTypeChange() {
    this.maybeForceShow();
  }

  maybeForceShow() {
    if (this.show && this.type === null) {
      this.type = 'other';
    }
  }

  @Watch('order')
  handleOrderChange(_, prev) {
    if (prev) return;
    this.setType((this?.order?.shipping_address as Address)?.country);
  }

  setType(key) {
    if (key === 'CA') {
      this.type = 'ca_gst';
      return;
    }
    if (key === 'AU') {
      this.type = 'au_abn';
      return;
    }
    if (key === 'GB') {
      this.type = 'gb_vat';
      return;
    }
    if (
      ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'EL', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'RO', 'SK', 'SI', 'ES', 'SE'].includes(key)
    ) {
      this.type = 'eu_vat';
      return;
    }
    this.type = null;
  }

  renderTaxStatusIcon() {
    if (this.tax_status !== 'tax_zone_not_found') return null;
    return <ce-icon name="alert-circle" slot="suffix" style={{ color: 'var(--ce-color-danger-500)', fontSize: 'var(--ce-font-size-large)' }}></ce-icon>;
  }

  componentDidLoad() {
    this.handleDraftChange();
    this.maybeForceShow();
  }

  render() {
    if (this.type === null) {
      return null;
    }

    return (
      <Fragment>
        <input type="hidden" name="tax_identifier.number_type" value={this.type} />
        <ce-input label={this?.zones?.[this?.type]?.label} name="tax_identifier.number">
          <ce-dropdown slot="suffix" position="bottom-right">
            <ce-button type="text" slot="trigger" caret loading={false}>
              {this?.zones?.[this?.type]?.label_small}
            </ce-button>
            <ce-menu>
              {Object.keys(this.zones || {}).map(name => (
                <ce-menu-item onClick={() => (this.type = name)} checked={this.type === name}>
                  {this.zones[name].label_small}
                </ce-menu-item>
              ))}
            </ce-menu>
          </ce-dropdown>
        </ce-input>
      </Fragment>
    );
  }
}

openWormhole(CeTaxIdInput, ['draft', 'order', 'tax_status'], false);
