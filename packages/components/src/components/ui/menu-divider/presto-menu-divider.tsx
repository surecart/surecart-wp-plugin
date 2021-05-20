import { Component, h } from '@stencil/core';

@Component({
  tag: 'presto-menu-divider',
  styleUrl: 'presto-menu-divider.scss',
  shadow: true,
})
export class PrestoMenuDivider {
  render() {
    return <div part="base" class="menu-divider" role="separator" aria-hidden="true"></div>;
  }
}
