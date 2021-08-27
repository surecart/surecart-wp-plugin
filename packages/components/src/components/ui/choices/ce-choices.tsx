import { Component, Prop, h, State, Element, Watch } from '@stencil/core';

@Component({
  tag: 'ce-choices',
  styleUrl: 'ce-choices.scss',
  shadow: true,
})
export class CEChoices {
  @Element() el: HTMLCeChoicesElement;

  /** The group label. Required for proper accessibility. Alternatively, you can use the label slot. */
  @Prop() label = '';

  /** Hides the fieldset and legend that surrounds the group. The label will still be read by screen readers. */
  @Prop({ attribute: 'hide-label' }) hideLabel: boolean = false;

  @Prop() columns: number = 1;

  @State() width: number;

  componentDidLoad() {
    // Only run if ResizeObserver is supported.
    if ('ResizeObserver' in self) {
      var ro = new ResizeObserver(entries => {
        entries.forEach(entry => {
          this.width = entry.contentRect.width;
        });
      });
      ro.observe(this.el);
    }
  }

  render() {
    return (
      <fieldset
        part="base"
        class={{
          'choices': true,
          'choices--hide-label': this.hideLabel,
          'breakpoint-sm': this.width < 384,
          'breakpoint-md': this.width >= 384 && this.width < 576,
          'breakpoint-lg': this.width >= 576 && this.width < 768,
          'breakpoint-xl': this.width >= 768,
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
