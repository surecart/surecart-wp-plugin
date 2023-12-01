import { Component, Prop, h, Host, Method } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';
import { __ } from '@wordpress/i18n';

@Component({
  tag: 'sc-order-password',
  styleUrl: 'sc-order-password.scss',
  shadow: true,
})
export class ScOrderPassword {
  private input: HTMLScPasswordElement;

  @Prop() loggedIn: boolean;

  /** The input's size. */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** The input's value attribute. */
  @Prop({ mutable: true }) value = '';

  /** Draws a pill-style input with rounded edges. */
  @Prop({ reflect: true }) pill = false;

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

  /** The input's autofocus attribute. */
  @Prop() autofocus: boolean;

  /** Does the email exist? */
  @Prop() emailExists: boolean;

  /** The input's password confirmation attribute. */
  @Prop({ reflect: true }) confirmation = false;

  /** The input's confirmation label text. */
  @Prop() confirmationLabel: string;

  /** The input's confirmation placeholder text. */
  @Prop() confirmationPlaceholder: string;

  /** The input's confirmation help text. */
  @Prop() confirmationHelp: string;

  /** Ensures strong password validation. */
  @Prop({ reflect: true }) enableValidation = true;

  @Method()
  async reportValidity() {
    return this.input?.reportValidity?.();
  }

  render() {
    if (this.loggedIn) {
      return <Host style={{ display: 'none' }}></Host>;
    }

    return (
      <sc-password
        label={this.label}
        aria-label={this.label}
        help={this.help}
        autofocus={this.autofocus}
        placeholder={this.placeholder}
        showLabel={this.showLabel}
        size={this.size ? this.size : 'medium'}
        name="password"
        ref={el => (this.input = el as HTMLScPasswordElement)}
        value={this.value}
        required={this.required}
        disabled={this.disabled}
        enableValidation={this.enableValidation}
        confirmationHelp={this.confirmationHelp}
        confirmationLabel={this.confirmationLabel}
        confirmationPlaceholder={this.confirmationPlaceholder}
        confirmation={this.confirmation}
      />
    );
  }
}

openWormhole(ScOrderPassword, ['loggedIn', 'emailExists'], false);
