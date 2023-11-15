import { Component, h } from '@stencil/core';

@Component({
  tag: 'sc-visually-hidden',
  styleUrl: 'sc-visually-hidden.css',
  shadow: true,
})
export class ScVisuallyHidden {
  render() {
    return <slot />;
  }
}
