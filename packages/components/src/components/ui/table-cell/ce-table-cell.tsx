import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'ce-table-cell',
  styleUrl: 'ce-table-cell.scss',
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
