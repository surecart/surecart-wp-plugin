import { Component, h } from '@stencil/core';

@Component({
  tag: 'presto-divider',
  styleUrl: 'presto-divider.scss',
  shadow: true,
})
export class PrestoDivider {
  render() {
    return (
      <div class="divider" part="base">
        <div class="line__container" aria-hidden="true">
          <div class="line" part="line"></div>
        </div>
        <div class="text__container">
          <span class="text" part="text">
            <slot></slot>
          </span>
        </div>
      </div>
    );
  }
}
