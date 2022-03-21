import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'sc-table-head',
  styleUrl: 'sc-table-head.scss',
  shadow: true,
})
export class ScTable {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
