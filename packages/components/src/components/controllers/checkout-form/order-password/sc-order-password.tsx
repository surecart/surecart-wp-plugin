import { Component, Prop, h, Method } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';

@Component({
  tag: 'sc-order-password',
  shadow: true,
})
export class ScOrderPassword {
  private input: HTMLScInputElement;

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

  @Method()
  async reportValidity() {
    return this.input?.reportValidity?.();
  }

  render() {
    if (this.loggedIn) {
      return null;
    }

    return (
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
    );
  }
}

openWormhole(ScOrderPassword, ['loggedIn'], false);
