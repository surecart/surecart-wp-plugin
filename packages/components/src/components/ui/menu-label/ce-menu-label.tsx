import { Component, h } from '@stencil/core';

@Component({
  tag: 'ce-menu-label',
  styleUrl: 'ce-menu-label.scss',
  shadow: true,
})
export class CeMenuLabel {
  render() {
    return (
      <div part="base" class="menu-label">
        <slot></slot>
      </div>
    );
  }
}
