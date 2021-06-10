import { Component, h, Prop, Element, State, Watch } from '@stencil/core';
import { createContext } from '../../context/utils/createContext';
import { Price } from '../../../types';
import state from './state';
const { Provider } = createContext(state);
import prices from './test/fixtures/prices.json';

@Component({
  tag: 'ce-checkout',
  styleUrl: 'ce-checkout.scss',
  shadow: false,
})
export class CECheckout {
  @Element() el: HTMLElement;

  @Prop() priceIds: Array<string> = ['dd514523-297b-4a86-b5ff-6db0a70d7e16', 'dd514523-297b-4a86-b5ff-6db0a70d7e17', '85109619-529d-47b3-98c3-ca90d22913e4'];
  @Prop() publishableKey: string;

  @State() message: string = '';
  @State() prices: Array<Price>;
  @State() loading: boolean;
  @State() total: number;
  @State() submitting: boolean;

  componentWillLoad() {
    this.fetchPrices();
  }

  @Watch('priceIds')
  fetchPrices() {
    this.loading = true;
    setTimeout(() => {
      this.prices = prices as Array<Price>;
      this.loading = false;
    }, 1000);
  }

  render() {
    return (
      <div class="ce-checkout-container">
        <Provider
          value={{
            price_ids: this.priceIds,
            prices: this.prices,
            submitting: this.submitting,
            loading: this.loading,
            total: this.total,
            paymentMethod: 'stripe',
            publishableKey: this.publishableKey,
          }}
        >
          <slot />
        </Provider>
      </div>
    );
  }
}
