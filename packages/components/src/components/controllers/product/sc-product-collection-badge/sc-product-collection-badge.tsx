import { Component, h } from '@stencil/core';

@Component({
  tag: 'sc-product-collection-badge',
  styleUrl: 'sc-product-collection-badge.scss',
  shadow: true,
})
export class ScProductCollectionBadge {
  render() {
    return (
      <span
        part="base"
        class={{
          tag: true,
        }}
      >
        <slot></slot>
      </span>
    );
  }
}
