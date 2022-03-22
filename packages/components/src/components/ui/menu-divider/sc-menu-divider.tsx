import { Component, h } from '@stencil/core';

@Component({
  tag: 'sc-menu-divider',
  styleUrl: 'sc-menu-divider.scss',
  shadow: true,
})
export class ScMenuDivider {
  render() {
    return <div part="base" class="menu-divider" role="separator" aria-hidden="true"></div>;
  }
}
