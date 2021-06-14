import { Component, h } from '@stencil/core';
import { createContext } from '../../context/utils/createContext';
const { Consumer } = createContext({});

@Component({
  tag: 'ce-payment-request',
  styleUrl: 'ce-payment-request.css',
  shadow: false,
})
export class CePaymentRequest {
  renderHTML = ({ total, paymentMethod, stripePublishableKey }) => {
    if (!paymentMethod) {
      return;
    }

    if ('stripe' === paymentMethod) {
      return (
        <ce-stripe-payment-request amount={total} publishable-key={stripePublishableKey}>
          <ce-divider>Or</ce-divider>
        </ce-stripe-payment-request>
      );
    }
  };

  render() {
    return <Consumer>{this.renderHTML}</Consumer>;
  }
}
