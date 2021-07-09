import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'ce-table',
  styleUrl: 'ce-table.scss',
  shadow: true,
})
export class CeTable {
  @Prop() headers: Array<string> = [];
  @Prop() data: Array<any>;

  render() {
    return (
      <table>
        <thead>
          <tr>
            <slot name="header" />
          </tr>
        </thead>
        <tbody>
          <slot />
        </tbody>
      </table>
    );
  }
}
