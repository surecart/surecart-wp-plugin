import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'ce-table-row',
  styleUrl: 'ce-table-row.scss',
  shadow: true,
})
export class CeTable {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
