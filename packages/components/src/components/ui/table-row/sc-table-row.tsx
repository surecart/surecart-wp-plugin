import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'sc-table-row',
  styleUrl: 'sc-table-row.scss',
  shadow: true,
})
export class ScTableRow {
  @Prop() href: string;
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
