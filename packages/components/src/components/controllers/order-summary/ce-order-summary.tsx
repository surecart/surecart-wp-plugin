import { Component, h } from '@stencil/core';

import { createContext } from '../../context/utils/createContext';
const { Consumer } = createContext({});

@Component({
  tag: 'ce-order-summary',
  styleUrl: 'ce-order-summary.css',
  shadow: true,
})
export class CEOrderSummary {
  renderHTML({ total, subtotal }) {
    return (
      <div>
        <div>Total{total}</div>
        <div>Subtotal{subtotal}</div>
      </div>
    );
  }
  render() {
    return <Consumer>{({ total, subtotal }) => this.renderHTML({ total, subtotal })}</Consumer>;
  }
}
