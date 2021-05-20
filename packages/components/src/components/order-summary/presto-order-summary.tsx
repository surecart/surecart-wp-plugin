import { Component, Host, h } from '@stencil/core';

import { createContext } from 'stencil-context';

const defaultValue = { products: [] };
const { Consumer } = createContext(defaultValue);

@Component({
  tag: 'presto-order-summary',
  styleUrl: 'presto-order-summary.css',
  shadow: true,
})
export class PrestoOrderSummary {
  render() {
    return (
      <Host>
        <Consumer>
          {({ products }) => {
            return JSON.stringify(products);
          }}
        </Consumer>
        <slot></slot>
      </Host>
    );
  }
}
