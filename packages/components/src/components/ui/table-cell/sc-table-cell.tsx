import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'sc-table-cell',
  styleUrl: 'sc-table-cell.scss',
  shadow: true,
})
export class ScTableScll {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
