import { Component, h } from '@stencil/core';

@Component({
  tag: 'ce-card',
  styleUrl: 'ce-card.scss',
  shadow: true,
})
export class CeCard {
  render() {
    return (
      <div class={{ card: true }}>
        <slot />
      </div>
    );
  }
}
