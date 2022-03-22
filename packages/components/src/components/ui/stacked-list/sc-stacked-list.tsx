import { Component, h } from '@stencil/core';

@Component({
  tag: 'sc-stacked-list',
  styleUrl: 'sc-stacked-list.scss',
  shadow: true,
})
export class ScStackedList {
  render() {
    return <slot></slot>;
  }
}
