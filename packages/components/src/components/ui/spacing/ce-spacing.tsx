import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'ce-spacing',
  styleUrl: 'ce-spacing.scss',
  shadow: true,
})
export class CeSpacing {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
