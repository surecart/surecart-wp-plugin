import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'ce-block-ui',
  styleUrl: 'ce-block-ui.scss',
  shadow: true,
})
export class CeBlockUi {
  @Prop() zIndex: number = 1;
  @Prop() transparent: boolean;
  @Prop() spinner: boolean;
  render() {
    return (
      <div class={{ overlay: true, transparent: this.transparent }} style={{ 'z-index': this.zIndex.toString() }}>
        <slot>{!this.transparent && this.spinner && <ce-spinner></ce-spinner>}</slot>
      </div>
    );
  }
}
