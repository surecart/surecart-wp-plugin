import { Component, Element, h, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../../functions/fetch';
import { Subscription } from '../../../../types';
import { onFirstVisible } from '../../../../functions/lazy';

@Component({
  tag: 'ce-subscriptions-list',
  styleUrl: 'ce-subscriptions-list.scss',
  shadow: true,
})
export class CeSubscriptionsList {
  @Element() el: HTMLCeSubscriptionsListElement;
  /** Customer id to fetch subscriptions */
  @Prop({ mutable: true }) query: {
    page: number;
    per_page: number;
  } = {
    page: 1,
    per_page: 10,
  };
  @Prop() allLink: string;
  @Prop() heading: string;
  @Prop() cancelBehavior: 'period_end' | 'immediate' = 'period_end';

  @State() subscriptions: Array<Subscription> = [];

  /** Loading state */
  @State() loading: boolean;
  @State() busy: boolean;

  /** Error message */
  @State() error: string;

  @State() pagination: {
    total: number;
    total_pages: number;
  } = {
    total: 0,
    total_pages: 0,
  };

  componentWillLoad() {
    onFirstVisible(this.el, () => {
      this.initialFetch();
    });
  }

  async initialFetch() {
    try {
      this.loading = true;
      await this.getSubscriptions();
    } catch (e) {
      console.error(this.error);
      this.error = e?.message || __('Something went wrong', 'checkout_engine');
    } finally {
      this.loading = false;
    }
  }

  async fetchSubscriptions() {
    try {
      this.busy = true;
      await this.getSubscriptions();
    } catch (e) {
      console.error(this.error);
      this.error = e?.message || __('Something went wrong', 'checkout_engine');
    } finally {
      this.busy = false;
    }
  }

  /** Get all subscriptions */
  async getSubscriptions() {
    const response = await await apiFetch({
      path: addQueryArgs(`checkout-engine/v1/subscriptions/`, {
        expand: ['price', 'price.product', 'latest_invoice'],
        ...this.query,
      }),
      parse: false,
    });
    this.pagination = {
      total: response.headers.get('X-WP-Total'),
      total_pages: response.headers.get('X-WP-TotalPages'),
    };
    this.subscriptions = (await response.json()) as Subscription[];
    return this.subscriptions;
  }

  nextPage() {
    this.query.page = this.query.page + 1;
    this.fetchSubscriptions();
  }

  prevPage() {
    this.query.page = this.query.page - 1;
    this.fetchSubscriptions();
  }

  renderEmpty() {
    return <slot name="empty">{__('You have no subscriptions.', 'checkout_engine')}</slot>;
  }

  renderLoading() {
    return (
      <ce-stacked-list-row style={{ '--columns': '2' }} mobile-size={0}>
        <div style={{ padding: '0.5em' }}>
          <ce-skeleton style={{ width: '30%', marginBottom: '0.75em' }}></ce-skeleton>
          <ce-skeleton style={{ width: '20%', marginBottom: '0.75em' }}></ce-skeleton>
          <ce-skeleton style={{ width: '40%' }}></ce-skeleton>
        </div>
      </ce-stacked-list-row>
    );
  }

  renderContent() {
    if (this.loading) {
      return this.renderLoading();
    }

    if (this.subscriptions?.length === 0) {
      return this.renderEmpty();
    }

    return this.subscriptions.map(subscription => {
      return (
        <ce-stacked-list-row
          href={
            subscription?.status !== 'canceled'
              ? addQueryArgs(window.location.href, {
                  action: 'edit',
                  model: 'subscription',
                  id: subscription.id,
                })
              : null
          }
          mobile-size={0}
        >
          <ce-subscription-details subscription={subscription}></ce-subscription-details>
          <ce-icon name="chevron-right" slot="suffix"></ce-icon>
        </ce-stacked-list-row>
      );
    });
  }

  render() {
    return (
      <ce-dashboard-module heading={this.heading || __('Subscriptions', 'checkout_engine')} class="subscriptions-list" error={this.error}>
        {!!this.allLink && (
          <ce-button type="link" href={this.allLink} slot="end">
            {__('View all', 'checkout_engine')}
            <ce-icon name="chevron-right" slot="suffix"></ce-icon>
          </ce-button>
        )}

        <ce-card no-padding style={{ '--overflow': 'hidden' }}>
          <ce-stacked-list>{this.renderContent()}</ce-stacked-list>
        </ce-card>

        {!this.allLink && (
          <ce-pagination
            page={this.query.page}
            perPage={this.query.per_page}
            total={this.pagination.total}
            totalPages={this.pagination.total_pages}
            totalShowing={this?.subscriptions?.length}
            onCeNextPage={() => this.nextPage()}
            onCePrevPage={() => this.prevPage()}
          ></ce-pagination>
        )}

        {this.busy && <ce-block-ui></ce-block-ui>}
      </ce-dashboard-module>
    );
  }
}
