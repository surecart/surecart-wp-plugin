import { Component, h, Prop, State, Watch } from '@stencil/core';
import { __, sprintf } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

import apiFetch from '../../../../functions/fetch';
import { intervalString } from '../../../../functions/price';
import { License, Price, Product, Purchase, Subscription } from '../../../../types';

@Component({
  tag: 'sc-subscription-details',
  styleUrl: 'sc-subscription-details.css',
  shadow: true,
})
export class ScSubscriptionDetails {
  @Prop() subscription: Subscription;
  @Prop() pendingPrice: Price;
  @Prop() hideRenewalText: boolean;

  @State() activationsModal: boolean;
  @State() loading: boolean;
  @State() hasPendingUpdate: boolean;

  renderName() {
    if (typeof this.subscription?.price?.product !== 'string') {
      return this.subscription?.price?.product?.name;
    }
    return __('Subscription', 'surecart');
  }

  @Watch('subscription')
  async handleSubscriptionChange() {
    this.hasPendingUpdate = !!Object.keys(this?.subscription?.pending_update || {})?.length;
    if (this?.subscription?.pending_update?.price && !this?.pendingPrice && !this.hideRenewalText) {
      this.pendingPrice = await this.fetchPrice(this.subscription.pending_update.price);
    }
  }

  componentWillLoad() {
    this.handleSubscriptionChange();
  }

  async fetchPrice(price_id: string) {
    try {
      this.loading = true;
      const price = await apiFetch({
        path: addQueryArgs(`surecart/v1/prices/${price_id}`, {
          expand: ['product'],
        }),
      });
      return price as Price;
    } catch (e) {
      console.error(e);
    } finally {
      this.loading = false;
    }
  }

  renderRenewalText() {
    const tag = <sc-subscription-status-badge subscription={this?.subscription}></sc-subscription-status-badge>;

    if (this?.subscription?.cancel_at_period_end && this?.subscription?.current_period_end_at) {
      return (
        <span>
          {tag} {sprintf(__('Your plan will be canceled on', 'surecart'))}{' '}
          <sc-format-date date={this.subscription.current_period_end_at * 1000} month="long" day="numeric" year="numeric"></sc-format-date>
        </span>
      );
    }

    if (this.hasPendingUpdate) {
      if (!this.pendingPrice && !this.subscription?.pending_update?.ad_hoc_amount) {
        return <sc-skeleton></sc-skeleton>;
      }

      if (this.subscription?.pending_update?.ad_hoc_amount) {
        return (
          <span>
            {__('Your plan switches to', 'surecart')}{' '}
            <strong>
              <sc-format-number
                type="currency"
                currency={this.pendingPrice?.currency || this.subscription?.price?.currency}
                value={this.subscription?.pending_update?.ad_hoc_amount}
              ></sc-format-number>{' '}
              {intervalString(this.pendingPrice || this.subscription?.price)}
            </strong>{' '}
            {__('on', 'surecart')}{' '}
            <sc-format-date date={this.subscription.current_period_end_at as number} type="timestamp" month="long" day="numeric" year="numeric"></sc-format-date>
          </span>
        );
      }
      return (
        <span>
          {__('Your plan switches to', 'surecart')} <strong>{(this.pendingPrice.product as Product).name}</strong> {__('on', 'surecart')}{' '}
          <sc-format-date date={this.subscription.current_period_end_at as number} type="timestamp" month="long" day="numeric" year="numeric"></sc-format-date>
        </span>
      );
    }

    if (this?.subscription?.status === 'trialing' && this?.subscription?.trial_end_at) {
      return (
        <span>
          {tag} {sprintf(__('Your plan begins on', 'surecart'))}{' '}
          <sc-format-date date={this?.subscription?.trial_end_at} type="timestamp" month="long" day="numeric" year="numeric"></sc-format-date>
        </span>
      );
    }
    if (this.subscription?.status === 'active' && this.subscription?.current_period_end_at) {
      return (
        <span>
          {tag} {this.subscription?.remaining_period_count === null ? __('Your plan renews on', 'surecart') : __('Your next payment is on', 'surecart')}{' '}
          <sc-format-date date={this?.subscription?.current_period_end_at} type="timestamp" month="long" day="numeric" year="numeric"></sc-format-date>
        </span>
      );
    }

    return tag;
  }

  getActivations() {
    return (((this.subscription?.purchase as Purchase)?.license as License)?.activations?.data || []).filter(activation => {
      return activation?.counted;
    });
  }

  renderActivations() {
    const activations = this.getActivations();
    if (!activations?.length) return null;
    return (
      <sc-flex justifyContent="flex-start" alignItems="center">
        <sc-tag size="small">{activations?.[0]?.name}</sc-tag>
        {activations?.length > 1 && (
          <sc-text
            style={{ '--font-size': 'var(--sc-font-size-small)', 'cursor': 'pointer' }}
            onClick={e => {
              e.preventDefault();
              e.stopImmediatePropagation();
              this.activationsModal = true;
            }}
          >
            + {activations?.length - 1} More
          </sc-text>
        )}
      </sc-flex>
    );
  }

  render() {
    return (
      <div class="subscription-details">
        {this.hasPendingUpdate && (
          <div>
            <sc-tag size="small" type="warning">
              {__('Update Scheduled', 'surecart')}
            </sc-tag>
          </div>
        )}

        <sc-flex alignItems="center" justifyContent="flex-start">
          <sc-text style={{ '--font-weight': 'var(--sc-font-weight-bold)' }}>{this.renderName()}</sc-text>
          {this.renderActivations()}
        </sc-flex>

        {!this.hideRenewalText && <div>{this.renderRenewalText()} </div>}

        <slot />

        <sc-dialog label={__('Activations', 'surecart')} onScRequestClose={() => (this.activationsModal = false)} open={!!this.activationsModal}>
          <sc-card no-padding style={{ '--overflow': 'hidden' }}>
            <sc-stacked-list>
              {(this.getActivations() || []).map(activation => {
                return (
                  <sc-stacked-list-row style={{ '--columns': '2' }} mobileSize={0}>
                    <sc-text style={{ '--line-height': 'var(--sc-line-height-dense)' }}>
                      <strong>{activation?.name}</strong>
                      <div>
                        <sc-text style={{ '--color': 'var(--sc-color-gray-500)' }}>{activation?.fingerprint}</sc-text>
                      </div>
                    </sc-text>
                    <sc-text style={{ '--color': 'var(--sc-color-gray-500)' }}>
                      <sc-format-date type="timestamp" month="short" day="numeric" year="numeric" date={activation?.created_at}></sc-format-date>
                    </sc-text>
                  </sc-stacked-list-row>
                );
              })}
            </sc-stacked-list>
          </sc-card>
        </sc-dialog>
      </div>
    );
  }
}
