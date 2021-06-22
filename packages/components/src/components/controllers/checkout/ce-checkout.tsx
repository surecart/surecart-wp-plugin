import { Component, h, Prop, Element, State, Watch, Listen, Event, EventEmitter } from '@stencil/core';
import { Price, Coupon } from '../../../types';
import { applyCoupon } from '../../../functions/total';
import { Universe } from 'stencil-wormhole';
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
  @Prop() currencyCode: string = 'usd';

  @State() message: string = '';
  @State() prices: Array<Price>;
  @State() selectedPriceIds: Set<string>;
  @State() coupon: Coupon;
  @State() loading: boolean;
  @State() subtotal: number = 0;
  @State() total: number = 0;
  @State() submitting: boolean;

  @Event() ceLoaded: EventEmitter<void>;

  @Listen('cePriceChange')
  handlePriceChange(e) {
    this.selectedPriceIds = e.detail;
  }

  @Watch('selectedPriceIds')
  handleSelectChange() {
    this.subtotal = 0;
    this.selectedPriceIds.forEach(id => {
      const price = this.prices.find(price => price.id === id);
      this.subtotal = this.subtotal + price.amount;
    });
  }

  @Watch('coupon')
  @Watch('subtotal')
  handleTotalCalculation() {
    this.total = applyCoupon(this.subtotal, this.coupon);
  }

  componentWillLoad() {
    // @ts-ignore
    Universe.create(this, this.state());

    this.fetchPrices();
  }

  @Watch('priceIds')
  async fetchPrices() {
    this.loading = true;

    try {
      let res = (await apiFetch({
        path: addQueryArgs('price', {
          active: true,
          ids: this.priceIds,
        }),
      })) as Array<Price>;

      // this does not allow prices witha different currency than provided
      this.prices = res.filter(price => {
        return price.currency === this.currencyCode;
      });

      // emit loaded
      this.ceLoaded.emit();
    } finally {
      this.loading = false;
    }
  }

  state() {
    return {
      paymentMethod: 'stripe',
      stripePublishableKey: this.stripePublishableKey,
      priceIds: this.priceIds,
      selectedPriceIds: this.selectedPriceIds,
      currencyCode: this.currencyCode,
      prices: this.prices,
      loading: this.loading,
      subtotal: this.subtotal,
      total: this.total,
    };
  }

  render() {
    return (
      <div class="ce-checkout-container">
        <Universe.Provider state={this.state()}>
          <slot />
        </Universe.Provider>
      </div>
    );
  }
}
