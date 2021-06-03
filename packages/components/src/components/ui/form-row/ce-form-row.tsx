import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'ce-form-row',
  styleUrl: 'ce-form-row.scss',
  shadow: true,
})
export class CEFormRow {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
