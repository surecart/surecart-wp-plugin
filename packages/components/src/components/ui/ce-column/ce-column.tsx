import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'ce-column',
  styleUrl: 'ce-column.css',
  shadow: true,
})
export class CeColumn {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
