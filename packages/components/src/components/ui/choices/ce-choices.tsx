import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'ce-choices',
  styleUrl: 'ce-choices.scss',
  shadow: true,
})
export class CEChoices {
  /** The group label. Required for proper accessibility. Alternatively, you can use the label slot. */
  @Prop() label = '';

  /** Hides the fieldset and legend that surrounds the group. The label will still be read by screen readers. */
  @Prop({ attribute: 'hide-label' }) hideLabel: boolean = false;

  @Prop() columns: number = 1;

  render() {
    return (
      <fieldset
        part="base"
        class={{
          'choices': true,
          'choices--hide-label': this.hideLabel,
        }}
        role="radiogroup"
      >
        <div part="label" class="choices__label">
          <slot name="label">{this.label}</slot>
        </div>
        <div part="choices" class="choices__items">
          <slot></slot>
        </div>
      </fieldset>
    );
  }
}
