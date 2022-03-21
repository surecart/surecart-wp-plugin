import { Component, h } from '@stencil/core';

@Component({
  tag: 'sc-menu-label',
  styleUrl: 'sc-menu-label.scss',
  shadow: true,
})
export class ScMenuLabel {
  render() {
    return (
      <div part="base" class="menu-label">
        <slot></slot>
      </div>
    );
  }
}
