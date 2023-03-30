import { Component, Prop, h, Method, Listen } from '@stencil/core';
import { isRtl } from '../../../functions/page-align';

@Component({
  tag: 'sc-radio-group',
  styleUrl: 'sc-radio-group.scss',
  shadow: true,
})
export class ScRadioGroup {
  /** The input for validation */
  private input: HTMLInputElement;

  /** The radio group label. Required for proper accessibility. */
  @Prop() label = '';

  /**
   * This will be true when the control is in an invalid state. Validity is determined by props such as `type`,
   * `required`, `minlength`, `maxlength`, and `pattern` using the browser's constraint validation API.
   */
  @Prop({ reflect: true, mutable: true }) invalid: boolean;

  /** The selected value of the control. */
  @Prop({ reflect: true, mutable: true }) value: string = '';

  /** Is one of these items required. */
  @Prop() required: boolean;

  /** Checks for validity and shows the browser's validation message if the control is invalid. */
  @Method()
  async reportValidity() {
    this.invalid = !this.input.checkValidity();
    return this.input.reportValidity();
  }

  @Listen('click')
  handleRadioClick(event) {
    const target = event.target as HTMLScRadioElement;
    if (target.disabled) {
      return;
    }
    this.value = target.value;
  }

  render() {
    return (
      <fieldset
        part="base"
        class={{
          'radio-group': true,
          'radio-group--invalid': this.invalid,
          'radio-group--is-required': this.required,
          'radio-group--is-rtl':isRtl()
        }}
        aria-invalid={this.invalid}
        role="radiogroup"
      >
        <legend part="label" class="radio-group__label">
          <slot name="label">{this.label}</slot>
        </legend>

        <input type="text" class="radio-group__hidden-input" ref={el => (this.input = el as HTMLInputElement)} required={this.required} value={this.value} tabindex="-1" />

        <slot></slot>
      </fieldset>
    );
  }
}
