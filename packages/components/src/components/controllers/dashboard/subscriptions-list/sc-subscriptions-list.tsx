import { Component, Element, h, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../../functions/fetch';
import { Subscription } from '../../../../types';
import { onFirstVisible } from '../../../../functions/lazy';

@Component({
  tag: 'sc-subscriptions-list',
  styleUrl: 'sc-subscriptions-list.scss',
  shadow: true,
})
export class ScSubscriptionsList {
  @Element() el: HTMLScSubscriptionsListElement;
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
  @Prop() isCustomer: boolean;
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
      this.error = e?.message || __('Something went wrong', 'surecart');
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
      this.error = e?.message || __('Something went wrong', 'surecart');
    } finally {
      this.busy = false;
    }
  }

  /** Get all subscriptions */
  async getSubscriptions() {
    if (!this.isCustomer) {
      return;
    }

    const response = (await await apiFetch({
      path: addQueryArgs(`surecart/v1/subscriptions/`, {
        expand: ['price', 'price.product', 'current_period', 'period.checkout'],
        ...this.query,
      }),
      parse: false,
    })) as Response;
    this.pagination = {
      total: parseInt(response.headers.get('X-WP-Total')),
      total_pages: parseInt(response.headers.get('X-WP-TotalPages')),
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
    return (
      <div>
        <sc-divider style={{ '--spacing': '0' }}></sc-divider>
        <slot name="empty">
          <sc-empty icon="repeat">{__("You don't have any subscriptions.", 'surecart')}</sc-empty>
        </slot>
      </div>
    );
  }

  renderLoading() {
    return (
      <sc-card no-padding style={{ '--overflow': 'hidden' }}>
        <sc-stacked-list>
          <sc-stacked-list-row style={{ '--columns': '2' }} mobile-size={0}>
            <div style={{ padding: '0.5em' }}>
              <sc-skeleton style={{ width: '30%', marginBottom: '0.75em' }}></sc-skeleton>
              <sc-skeleton style={{ width: '20%', marginBottom: '0.75em' }}></sc-skeleton>
              <sc-skeleton style={{ width: '40%' }}></sc-skeleton>
            </div>
          </sc-stacked-list-row>
        </sc-stacked-list>
      </sc-card>
    );
  }

  renderList() {
    return this.subscriptions.map(subscription => {
      return (
        <sc-stacked-list-row
          href={
            subscription?.status !== 'canceled'
              ? addQueryArgs(window.location.href, {
                  action: 'edit',
                  model: 'subscription',
                  id: subscription.id,
                })
              : null
          }
          key={subscription.id}
          mobile-size={0}
        >
          <sc-subscription-details subscription={subscription}></sc-subscription-details>
          <sc-icon name="chevron-right" slot="suffix"></sc-icon>
        </sc-stacked-list-row>
      );
    });
  }

  renderContent() {
    if (this.loading) {
      return this.renderLoading();
    }

    if (this.subscriptions?.length === 0) {
      return this.renderEmpty();
    }

    return (
      <sc-card no-padding style={{ '--overflow': 'hidden' }}>
        <sc-stacked-list>{this.renderList()}</sc-stacked-list>
      </sc-card>
    );
  }

  render() {
    return (
      <sc-dashboard-module class="subscriptions-list" error={this.error}>
        <span slot="heading">
          <slot name="heading">{this.heading || __('Subscriptions', 'surecart')}</slot>
        </span>

        {!!this.allLink && !!this.subscriptions?.length && (
          <sc-button type="link" href={this.allLink} slot="end">
            {__('View all', 'surecart')}
            <sc-icon name="chevron-right" slot="suffix"></sc-icon>
          </sc-button>
        )}

        {this.renderContent()}

        {!this.allLink && (
          <sc-pagination
            page={this.query.page}
            perPage={this.query.per_page}
            total={this.pagination.total}
            totalPages={this.pagination.total_pages}
            totalShowing={this?.subscriptions?.length}
            onScNextPage={() => this.nextPage()}
            onScPrevPage={() => this.prevPage()}
          ></sc-pagination>
        )}

        {this.busy && <sc-block-ui></sc-block-ui>}
      </sc-dashboard-module>
    );
  }
}
