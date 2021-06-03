import { Component, h } from '@stencil/core';

@Component({
  tag: 'ce-menu-divider',
  styleUrl: 'ce-menu-divider.scss',
  shadow: true,
})
export class CEMenuDivider {
  render() {
    return <div part="base" class="menu-divider" role="separator" aria-hidden="true"></div>;
  }
}
