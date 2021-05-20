import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'presto-radio-group',
  styleUrl: 'presto-radio-group.scss',
  shadow: true,
})
export class PrestoRadioGroup {
  /** The radio group label. Required for proper accessibility. */
  @Prop() label = '';

  /** Hides the fieldset and legend that surrounds the radio group. The label will still be read by screen readers. */
  @Prop({ attribute: 'no-fieldset' }) noFieldset: boolean = false;

  render() {
    return (
      <fieldset
        part="base"
        class={{
          'radio-group': true,
          'radio-group--no-fieldset': this.noFieldset,
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
