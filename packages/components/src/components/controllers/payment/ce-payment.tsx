import { Component, h } from '@stencil/core';
import { createContext } from '../../context/utils/createContext';
const { Consumer } = createContext({});

@Component({
  tag: 'ce-payment',
  styleUrl: 'ce-payment.css',
  shadow: false,
})
export class CePayment {
  renderHTML = ({ paymentMethod, stripePublishableKey }) => {
    if (!paymentMethod) {
      return;
    }

    if ('stripe' === paymentMethod) {
      return <ce-stripe-element publishable-key={stripePublishableKey}></ce-stripe-element>;
    }
  };

  render() {
    return <Consumer>{this.renderHTML}</Consumer>;
  }
}
