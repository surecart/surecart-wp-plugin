import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'sc-tag',
  styleUrl: 'sc-tag.scss',
  shadow: true,
})
export class ScTag {
  @Event() scClear: EventEmitter<ScTag>;

  /** The tag's type. */
  @Prop({ reflect: true }) type: 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'default' = 'default';

  /** The tag's size. */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** Draws a pill-style tag with rounded edges. */
  @Prop({ reflect: true }) pill: boolean = false;

  /** Makes the tag clearable. */
  @Prop() clearable: boolean = false;

  handleClearClick() {
    this.scClear.emit(this);
  }

  render() {
    return (
      <span
        part="base"
        onClick={() => this.handleClearClick()}
        class={{
          'tag': true,
          // Types
          'tag--primary': this.type === 'primary',
          'tag--success': this.type === 'success',
          'tag--info': this.type === 'info',
          'tag--warning': this.type === 'warning',
          'tag--danger': this.type === 'danger',
          'tag--default': this.type === 'default',
          // Sizes
          'tag--small': this.size === 'small',
          'tag--medium': this.size === 'medium',
          'tag--large': this.size === 'large',
          // Modifers
          'tag--pill': this.pill,
          'tag--clearable': this.clearable,
        }}
      >
        <span part="content" class="tag__content">
          <slot></slot>
        </span>
        {!!this.clearable && (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path>
          </svg>
        )}
      </span>
    );
  }
}
