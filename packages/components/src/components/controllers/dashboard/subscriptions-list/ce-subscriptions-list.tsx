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
  @Prop() query: object;
  @Prop() cancelBehavior: 'period_end' | 'immediate' = 'period_end';

  @State() subscriptions: Array<Subscription> = [];

  /** Loading state */
  @State() loading: boolean;

  /** Error message */
  @State() error: string;

  /** Does this have a title slot */
  @State() hasTitleSlot: boolean;

  componentWillLoad() {
    onFirstVisible(this.el, () => {
      this.getSubscriptions();
    });
    this.handleSlotChange();
  }

  handleSlotChange() {
    this.hasTitleSlot = !!this.el.querySelector('[slot="title"]');
  }

  /** Get all subscriptions */
  async getSubscriptions() {
    if (!this.query) return;
    try {
      this.loading = true;
      this.subscriptions = (await await apiFetch({
        path: addQueryArgs(`checkout-engine/v1/subscriptions/`, {
          expand: ['price', 'price.product', 'latest_invoice'],
          ...this.query,
        }),
      })) as Subscription[];
    } catch (e) {
      if (e?.message) {
        this.error = e.message;
      } else {
        this.error = __('Something went wrong', 'checkout_engine');
      }
      console.error(this.error);
    } finally {
      this.loading = false;
    }
  }

  render() {
    if (this.loading) {
      return (
        <ce-card>
          <ce-flex>
            <ce-flex flex-direction="column" style={{ flex: '1' }}>
              <ce-skeleton style={{ width: '30%', display: 'inline-block' }}></ce-skeleton>
              <ce-skeleton style={{ width: '20%', display: 'inline-block' }}></ce-skeleton>
              <ce-skeleton style={{ width: '40%', display: 'inline-block' }}></ce-skeleton>
            </ce-flex>
            <ce-flex flex-direction="column">
              <ce-skeleton style={{ width: '200px' }}></ce-skeleton>
              <ce-skeleton style={{ width: '200px' }}></ce-skeleton>
            </ce-flex>
          </ce-flex>
        </ce-card>
      );
    }

    if (this.error) {
      return (
        <ce-alert open type="danger">
          <span slot="title">{__('Error', 'checkout_engine')}</span>
          {this.error}
        </ce-alert>
      );
    }

    if (!this?.subscriptions?.length) {
      return <slot name="empty">{__('You have no subscriptions.', 'checkout_engine')}</slot>;
    }

    return (
      <ce-card borderless no-divider>
        <span slot="title">
          <slot name="title" />
        </span>
        <ce-spacing style={{ '--spacing': 'var(--ce-spacing-large)' }}>
          {this.subscriptions.map(subscription => {
            return <ce-subscription subscription={subscription}></ce-subscription>;
          })}
        </ce-spacing>
      </ce-card>
    );
  }
}
