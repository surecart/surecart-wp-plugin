import { Component, Prop, h, State, Element } from '@stencil/core';

let id = 0;

@Component({
  tag: 'ce-choices',
  styleUrl: 'ce-choices.scss',
  shadow: true,
})
export class CEChoices {
  @Element() el: HTMLCeChoicesElement;

  private inputId: string = `choices-${++id}`;
  private helpId = `choices-help-text-${id}`;
  private labelId = `choices-label-${id}`;

  /** The group label. Required for proper accessibility. Alternatively, you can use the label slot. */
  @Prop() label = '';

  /** Input size */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** Required */
  @Prop() required: boolean = false;

  /** Should we show the label */
  @Prop() showLabel: boolean = true;

  /** The input's help text. */
  @Prop() help: string = '';

  /** Hides the fieldset and legend that surrounds the group. The label will still be read by screen readers. */
  @Prop({ attribute: 'hide-label' }) hideLabel: boolean = false;

  /** Number of columns on desktop */
  @Prop() columns: number = 1;

  /** Validation error message. */
  @Prop() errorMessage: string = '';

  @State() width: number;

  componentDidLoad() {
    // Only run if ResizeObserver is supported.
    if ('ResizeObserver' in window) {
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
        <ce-form-control
          size={this.size}
          required={this.required}
          label={this.label}
          showLabel={this.showLabel}
          help={this.help}
          inputId={this.inputId}
          helpId={this.helpId}
          labelId={this.labelId}
          errorMessage={this.errorMessage}
        >
          <div part="choices" class="choices__items">
            <slot></slot>
          </div>
        </ce-form-control>
      </fieldset>
    );
  }
}
