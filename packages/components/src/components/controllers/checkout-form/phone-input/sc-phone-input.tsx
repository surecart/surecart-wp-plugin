import { Component, Prop, h } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';
import { __ } from '@wordpress/i18n';

@Component({
  tag: 'sc-phone-input',
  styleUrl: 'sc-phone-input.css',
  shadow: true,
})
export class ScPhoneInput {
  /** Is the user logged in. */
  @Prop() loggedIn: boolean;

  /** The input's size. */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** The input's value attribute. */
  @Prop({ mutable: true }) value = '';

  /** The input's label. */
  @Prop() label: string;

  /** Should we show the label */
  @Prop() showLabel: boolean = true;

  /** The input's help text. */
  @Prop() help: string = '';

  /** The input's placeholder text. */
  @Prop() placeholder: string;

  /** Disables the input. */
  @Prop({ reflect: true }) disabled: boolean = false;

  /** Makes the input readonly. */
  @Prop({ reflect: true }) readonly: boolean = false;

  /** Makes the input a required field. */
  @Prop({ reflect: true }) required = false;

  render() {
    return (
      <sc-customer-phone
        label={this.label}
        help={this.help}
        value={this.value}
        disabled={!!this.loggedIn}
        placeholder={this.placeholder}
        readonly={this.readonly}
        required={this.required}
        size={this.size}
        show-label={this.showLabel}
      ></sc-customer-phone>
    );
  }
}

openWormhole(ScPhoneInput, ['order', 'customer'], false);
