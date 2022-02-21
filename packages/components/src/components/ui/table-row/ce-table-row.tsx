import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'ce-table-row',
  styleUrl: 'ce-table-row.scss',
  shadow: true,
})
export class CeTableRow {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
