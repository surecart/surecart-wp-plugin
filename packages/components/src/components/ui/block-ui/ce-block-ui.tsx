import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'ce-block-ui',
  styleUrl: 'ce-block-ui.scss',
  shadow: true,
})
export class CeBlockUi {
  @Prop() zIndex: number = 1;
  render() {
    return (
      <div class="overlay" style={{ 'z-index': this.zIndex.toString() }}>
        <slot>
          <ce-spinner></ce-spinner>
        </slot>
      </div>
    );
  }
}
