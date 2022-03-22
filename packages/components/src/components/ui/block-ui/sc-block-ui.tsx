import { Component, h, Prop } from '@stencil/core';

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
      <div class={{ overlay: true, transparent: this.transparent }} style={{ 'z-index': this.zIndex.toString() }}>
        <slot>{!this.transparent && this.spinner && <sc-spinner></sc-spinner>}</slot>
      </div>
    );
  }
}
