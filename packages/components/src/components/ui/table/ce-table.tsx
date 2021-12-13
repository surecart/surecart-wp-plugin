import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'ce-table',
  styleUrl: 'ce-table.scss',
  shadow: true,
})
export class CeTable {
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
