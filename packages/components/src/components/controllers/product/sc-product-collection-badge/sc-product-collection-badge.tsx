import { Component, h,Host } from '@stencil/core';

@Component({
  tag: 'sc-product-collection-badge',
  styleUrl: 'sc-product-collection-badge.scss',
  shadow: true,
})
export class ScProductCollectionBadge {
  render() {
    return (
      <Host
        part="base"
        class={{
          tag: true,
        }}
      >
        <slot></slot>
      </Host>
    );
  }
}
