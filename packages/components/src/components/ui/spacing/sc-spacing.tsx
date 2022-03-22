import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'sc-spacing',
  styleUrl: 'sc-spacing.scss',
  shadow: true,
})
export class ScSpacing {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
