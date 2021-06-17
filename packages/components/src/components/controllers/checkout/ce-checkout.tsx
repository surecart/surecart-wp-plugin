import { Component, h, Prop, Element, State, Watch } from '@stencil/core';
import { createContext } from '../../context/utils/createContext';
import { Price } from '../../../types';
import state from './state';
const { Provider } = createContext(state);
import apiFetch from '../../../functions/fetch';
import { addQueryArgs } from '@wordpress/url';
@Component({
  tag: 'ce-checkout',
  styleUrl: 'ce-checkout.scss',
  shadow: false,
})
export class CECheckout {
  @Element() el: HTMLElement;

  @Prop() priceIds: Array<string>;
  @Prop() stripePublishableKey: string;

  @State() message: string = '';
  @State() prices: Array<Price>;
  @State() selectedPriceIds: Array<string>;
  @State() loading: boolean;
  @State() total: number;
  @State() submitting: boolean;

  componentWillLoad() {
    this.fetchPrices();
  }

  @Watch('priceIds')
  async fetchPrices() {
    this.loading = true;

    try {
      let res = await apiFetch({
        path: addQueryArgs('price', {
          active: true,
          ids: this.priceIds,
        }),
      });
      this.prices = res as Array<Price>;
    } finally {
      this.loading = false;
    }
  }

  render() {
    return (
      <div class="ce-checkout-container">
        <Provider
          value={{
            price_ids: this.priceIds,
            prices: this.prices,
            selectedPriceIds: this.selectedPriceIds,
            submitting: this.submitting,
            loading: this.loading,
            total: this.total,
            paymentMethod: 'stripe',
            stripePublishableKey: this.stripePublishableKey,
          }}
        >
          {JSON.stringify(this.selectedPriceIds)}
          <slot />
        </Provider>
      </div>
    );
  }
}
