import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'sc-column',
  styleUrl: 'sc-column.css',
  shadow: true,
})
export class ScColumn {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
