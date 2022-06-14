import { Component, h, Prop, Fragment, Watch, Event, EventEmitter } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { zones, getType } from '../../../functions/tax';

@Component({
  tag: 'sc-tax-id-input',
  styleUrl: 'sc-tax-id-input.css',
  shadow: false,
})
export class ScTaxIdInput {
  /** Label for the field. */
  @Prop() country: string;

  /** Force show the field. */
  @Prop() show: boolean = false;

  /** Type of tax id */
  @Prop({ mutable: true }) type: string = 'other';

  /** Tax ID Number */
  @Prop({ mutable: true }) number: string = null;

  /** Help text. */
  @Prop() help: string;

  /** Make a request to update the order. */
  @Event() scChange: EventEmitter<{ number: string; number_type: string }>;

  /** Make a request to update the order. */
  @Event() scInput: EventEmitter<Partial<{ number: string; number_type: string }>>;

  /** Change the number */
  @Event() scInputNumber: EventEmitter<string>;

  /** Change the Type */
  @Event() scInputType: EventEmitter<string>;

  /** Set the checkout state. */
  @Event() scSetState: EventEmitter<string>;

  @Watch('number')
  @Watch('type')
  handleNumberTypeChange() {
    if (this.number && this.type) {
      this.scChange.emit({
        number: this.number,
        number_type: this.type,
      });
    }
  }

  @Watch('country')
  handleCountryChange() {
    this.type = getType(this.country);
  }

  componentWillLoad() {
    this.type = getType(this.country);
  }

  render() {
    return (
      <Fragment>
        <input
          type="hidden"
          name="tax_identifier.number_type"
          value={this.type}
          onInput={(e: any) => {
            e.stopPropagation();
            this.scInput.emit({
              number: this.number,
              number_type: e.target.value,
            });
            this.scInputType.emit(e.target.value);
          }}
        />
        <sc-input
          label={zones?.[this?.type || 'other']?.label}
          name="tax_identifier.number"
          value={this.number}
          help={this.help}
          onScChange={(e: any) => (this.number = e.target.value)}
          onScInput={(e: any) => {
            e.stopPropagation();
            this.scInput.emit({
              number: e.target.value,
              number_type: this.type,
            });
            this.scInputNumber.emit(e.target.value);
          }}
        >
          <sc-dropdown slot="suffix" position="bottom-right" placement="bottom-end">
            <sc-button type="text" slot="trigger" caret loading={false}>
              {zones?.[this?.type || 'other']?.label_small}
            </sc-button>
            <sc-menu>
              {Object.keys(zones || {}).map(name => (
                <sc-menu-item onClick={() => (this.type = name)} checked={this.type === name}>
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
