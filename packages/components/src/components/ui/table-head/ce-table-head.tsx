import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'ce-table-head',
  styleUrl: 'ce-table-head.scss',
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
