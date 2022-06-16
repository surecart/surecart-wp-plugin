import { Component, h, Prop, Fragment, Watch, Event, EventEmitter } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { zones, getType } from '../../../functions/tax';

@Component({
  tag: 'sc-tax-id-input',
  styleUrl: 'sc-tax-id-input.css',
  shadow: true,
})
export class ScTaxIdInput {
  /** Label for the field. */
  @Prop() country: string;

  /** Force show the field. */
  @Prop() show: boolean = false;

  /** Type of tax id */
  @Prop({ mutable: true }) type: string = 'other';

  /** Tax ID Number */
  @Prop() number: string = null;

  /** The status */
  @Prop() status: 'valid' | 'invalid' | 'unknown' = 'unknown';

  /** Is this loading? */
  @Prop() loading: boolean;

  /** Make a request to update the order. */
  @Event() scChange: EventEmitter<{ number: string; number_type: string }>;

  /** Set the checkout state. */
  @Event() scSetState: EventEmitter<string>;

  @Watch('country')
  handleCountryChange() {
    this.type = getType(this.country);
  }

  componentWillLoad() {
    this.type = getType(this.country);
  }

  renderStatus() {
    if (this.status === 'valid') {
      return <sc-icon name="check" slot="prefix" style={{ color: 'var(--sc-color-success-500)' }}></sc-icon>;
    }
    if (this.status === 'invalid') {
      return <sc-icon name="x" slot="prefix" style={{ color: 'var(--sc-color-danger-500)' }}></sc-icon>;
    }
  }

  render() {
    return (
      <Fragment>
        <sc-input name="tax_identifier.number_type" value={this.type} style={{ display: 'none' }} />

        <sc-input
          label={zones?.[this?.type || 'other']?.label}
          name="tax_identifier.number"
          value={this.number}
          onScChange={(e: any) => {
            e.stopImmediatePropagation();
            this.scChange.emit({
              number: e.target.value,
              number_type: this.type || 'other',
            });
          }}
        >
          {this.loading && this.type === 'eu_vat' ? <sc-spinner slot="prefix" style={{ '--spinner-size': '10px' }}></sc-spinner> : this.renderStatus()}

          <sc-dropdown slot="suffix" position="bottom-right">
            <sc-button type="text" slot="trigger" caret loading={false} style={{ color: 'var(--sc-input-label-color)' }}>
              {zones?.[this?.type || 'other']?.label_small}
            </sc-button>
            <sc-menu>
              {Object.keys(zones || {}).map(name => (
                <sc-menu-item
                  onClick={() => {
                    this.scChange.emit({
                      number: this.number,
                      number_type: name,
                    });
                  }}
                  checked={this.type === name}
                >
                  {zones[name].label_small}
                </sc-menu-item>
              ))}
            </sc-menu>
          </sc-dropdown>
        </sc-input>
      </Fragment>
    );
  }
}
