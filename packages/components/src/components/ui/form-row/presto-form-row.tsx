import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'presto-form-row',
  styleUrl: 'presto-form-row.scss',
  shadow: true,
})
export class PrestoFormRow {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
