import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'sc-table',
  styleUrl: 'sc-table.scss',
  shadow: true,
})
export class ScTable {
  render() {
    return (
      <Host>
        <slot name="head"></slot>
        <slot></slot>
        <slot name="footer"></slot>
      </Host>
    );
  }
}
