import { Component, Host, h } from '@stencil/core';

// import { createContext } from 'stencil-context';

// const defaultValue = { products: [] };
// const { Consumer } = createContext(defaultValue);

@Component({
  tag: 'ce-order-summary',
  styleUrl: 'ce-order-summary.css',
  shadow: true,
})
export class CEOrderSummary {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
