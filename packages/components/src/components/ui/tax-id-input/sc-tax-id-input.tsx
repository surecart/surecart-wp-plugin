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
  @Prop({ mutable: true }) type: string = null;

  /** Tax ID Number */
  @Prop({ mutable: true }) number: string = null;

  /** Make a request to update the order. */
  @Event() scChange: EventEmitter<{ number: string; number_type: string }>;

  /** Set the checkout state. */
  @Event() scSetState: EventEmitter<string>;

  @Watch('type')
  handleTypeChange() {
    this.maybeForceShow();
  }

  maybeForceShow() {
    if (this.show && this.type === null) {
      this.type = 'other';
    }
  }

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
    this.maybeForceShow();
    this.type = getType(this.country);
  }

  render() {
    if (this.type === null) {
      return null;
    }

    return (
      <Fragment>
        <input type="hidden" name="tax_identifier.number_type" value={this.type} />
        <sc-input label={zones?.[this?.type]?.label} name="tax_identifier.number" value={this.number} onScChange={(e: any) => (this.number = e.target.value)}>
          <sc-dropdown slot="suffix" position="bottom-right">
            <sc-button type="text" slot="trigger" caret loading={false}>
              {zones?.[this?.type]?.label_small}
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
