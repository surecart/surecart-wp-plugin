import { Component, h } from '@stencil/core';

@Component({
  tag: 'ce-stacked-list',
  styleUrl: 'ce-stacked-list.scss',
  shadow: true,
})
export class CeStackedList {
  render() {
    return <slot></slot>;
  }
}
