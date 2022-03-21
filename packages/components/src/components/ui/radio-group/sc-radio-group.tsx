import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'sc-radio-group',
  styleUrl: 'sc-radio-group.scss',
  shadow: true,
})
export class ScRadioGroup {
  /** The radio group label. Required for proper accessibility. */
  @Prop() label = '';

  render() {
    return (
      <fieldset
        part="base"
        class={{
          'radio-group': true,
        }}
        role="radiogroup"
      >
        <legend part="label" class="radio-group__label">
          <slot name="label">{this.label}</slot>
        </legend>
        <slot></slot>
      </fieldset>
    );
  }
}
