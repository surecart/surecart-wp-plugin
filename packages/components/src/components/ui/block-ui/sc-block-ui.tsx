import { Component, h, Prop } from '@stencil/core';

/**
 * @part base - The elements base wrapper.
 * @part content - The content (spinner)
 */
@Component({
  tag: 'sc-block-ui',
  styleUrl: 'sc-block-ui.scss',
  shadow: true,
})
export class ScBlockUi {
  @Prop() zIndex: number = 1;
  @Prop() transparent: boolean;
  @Prop() spinner: boolean;
  render() {
    return (
      <div part="base" class={{ overlay: true, transparent: this.transparent }} style={{ 'z-index': this.zIndex.toString() }}>
        <div class="overlay__content" part="content">
          <slot name="spinner">{!this.transparent && this.spinner && <sc-spinner></sc-spinner>}</slot>
          <slot></slot>
        </div>
      </div>
    );
  }
}
