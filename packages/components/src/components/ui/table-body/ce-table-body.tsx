import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'ce-table-body',
  styleUrl: 'ce-table-body.scss',
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
