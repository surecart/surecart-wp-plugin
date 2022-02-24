import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'ce-table-row',
  styleUrl: 'ce-table-row.scss',
  shadow: true,
})
export class CeTableRow {
  @Prop() href: string;
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
