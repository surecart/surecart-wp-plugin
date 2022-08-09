import { Component, Element,  Fragment,  h, Prop, State } from '@stencil/core';
import {  _n, __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../../functions/fetch';
import { Checkout, Order, Product } from '../../../../types';
import { onFirstVisible } from '../../../../functions/lazy';
import { intervalString } from '../../../../functions/price';

@Component({
  tag: 'sc-order',
  styleUrl: 'sc-order.scss',
  shadow: true,
})
export class ScOrder {
  @Element() el: HTMLScOrdersListElement;
  @Prop() orderId: string;
  @Prop() heading: string;

  @State() order: Order;

  /** Loading state */
  @State() loading: boolean;
  @State() busy: boolean;

  /** Error message */
  @State() error: string;

  /** Only fetch if visible */
  componentDidLoad() {
    onFirstVisible(this.el, () => {
      this.initialFetch();
    });
  }

  async initialFetch() {
    try {
      this.loading = true;
      await this.getOrder();
    } catch (e) {
      console.error(this.error);
      this.error = e?.message || __('Something went wrong', 'surecart');
    } finally {
      this.loading = false;
    }
  }

  async fetchOrder() {
    try {
      this.busy = true;
      await this.getOrder();
    } catch (e) {
      console.error(this.error);
      this.error = e?.message || __('Something went wrong', 'surecart');
    } finally {
      this.busy = false;
    }
  }

  /** Get all orders */
  async getOrder() {
    this.order = (await await apiFetch({
      path: addQueryArgs(`surecart/v1/orders/${this.orderId}`, {
        expand: ['checkout', 'checkout.line_items', 'line_item.price', 'price.product', 'charge'],
      }),
    })) as Order;
  }

  renderLoading() {
    return (
      <sc-flex flexDirection='column' style={{'gap': '1em'}}>
        <sc-skeleton style={{ width: '20%', display: 'inline-block' }}></sc-skeleton>
        <sc-skeleton style={{ width: '60%', display: 'inline-block' }}></sc-skeleton>
        <sc-skeleton style={{ width: '40%', display: 'inline-block' }}></sc-skeleton>
      </sc-flex>
    );
  }

  renderEmpty() {
    return (
      <sc-empty icon="shopping-bag">{__("Order not found.", 'surecart')}</sc-empty>
    );
  }

  renderContent() {
    if (this.loading) {
      return this.renderLoading();
    }

    if (!this.order?.id) {
      return this.renderEmpty();
    }

    return <Fragment>
      {((this?.order?.checkout as Checkout)?.line_items?.data || []).map((item) => {
					return (
						<sc-product-line-item
							key={item.id}
							imageUrl={item?.price?.metadata?.wp_attachment_src}
							name={(item?.price?.product as Product)?.name}
							editable={false}
							removable={false}
							quantity={item.quantity}
							amount={item.subtotal_amount}
							currency={item?.price?.currency}
							trialDurationDays={item?.price?.trial_duration_days}
							interval={intervalString(item?.price)}
						></sc-product-line-item>
					);
				})}
    </Fragment>
    // return (
    //   <sc-card>

    //   </sc-card>
    // );
  }

  render() {
    return (
      <sc-dashboard-module class="orders-list" error={this.error}>
        <span slot="heading">{__('Order Details', 'surecart')}</span>
        <sc-card>
          {this.renderContent()}
        </sc-card>
      </sc-dashboard-module>
    );
  }
}
