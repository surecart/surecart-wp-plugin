import { Component, h } from '@stencil/core';

/**
 * @part base - The elements base wrapper.
 * @part line-container - The line container.
 * @part line - The line.
 * @part text-container - The text container.
 * @part text - The text.
 */
@Component({
  tag: 'sc-divider',
  styleUrl: 'sc-divider.scss',
  shadow: true,
})
export class ScDivider {
  render() {
    return (
      <div class="divider" part="base">
        <div class="line__container" aria-hidden="true" part="line-container">
          <div class="line" part="line"></div>
        </div>
        <div class="text__container" part="text-container">
          <span class="text" part="text">
            <slot></slot>
          </span>
        </div>
      </div>
    );
  }
}
