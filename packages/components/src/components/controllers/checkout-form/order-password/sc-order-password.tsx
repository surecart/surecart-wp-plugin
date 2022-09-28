import { Component, Prop, h, Method } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';
import { __ } from '@wordpress/i18n';

@Component({
  tag: 'sc-order-password',
  styleUrl: 'sc-order-password.scss',
  shadow: true,
})
export class ScOrderPassword {
  private input: HTMLScInputElement;
  private confirmInput: HTMLScInputElement;

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

  /** The input's password confirmation attribute. */
  @Prop({ reflect: true }) confirmation = false;

  /** The input's confirmation label text. */
  @Prop() confirmation_label: string;

  /** The input's confirmation placeholder text. */
  @Prop() confirmation_placeholder: string;

  /** The input's confirmation help text. */
  @Prop() confirmation_help: string;

  @Method()
  async reportValidity() {
    if (this.loggedIn) return true;

    if ( this.input?.value !== this.confirmInput?.value ) {
      this.input.setCustomValidity( __( 'Confirmation Password Not Match.', 'surecart' ) );
    } else {
      this.input.setCustomValidity('');
    }

    return this.input.reportValidity();
  }

  render() {
    if (this.loggedIn) {
      return null;
    }

    return (
      <div>
        <sc-input
          ref={el => (this.input = el as HTMLScInputElement)}
          label={this.label}
          help={this.help}
          autofocus={this.autofocus}
          placeholder={this.placeholder}
          showLabel={this.showLabel}
          size={this.size ? this.size : 'medium'}
          type="password"
          name="password"
          value={this.value}
          required={this.required}
          disabled={this.disabled}
        ></sc-input>
        {this.confirmation && (
          <sc-input
            ref={el => (this.confirmInput = el as HTMLScInputElement)}
            label={this.confirmation_label}
            help={this.confirmation_help}
            placeholder={this.confirmation_placeholder}
            size={this.size ? this.size : 'medium'}
            type="password"
            value={this.value}
            required={this.required}
            disabled={this.disabled}
          ></sc-input>
        )}
      </div>  
    );
  }
}

openWormhole(ScOrderPassword, ['loggedIn'], false);
