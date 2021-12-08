import { Component, h } from '@stencil/core';

@Component({
  tag: 'ce-heading',
  styleUrl: 'ce-heading.scss',
  shadow: true,
})
export class CeHeading {
  render() {
    return (
      <div class={{ heading: true }} part="base">
        <div class={{ heading__text: true }}>
          <div class="heading__title">
            <slot></slot>
          </div>
          <div class="heading__description">
            <slot name="description"></slot>
          </div>
        </div>
        <slot name="end"></slot>
      </div>
    );
  }
}
