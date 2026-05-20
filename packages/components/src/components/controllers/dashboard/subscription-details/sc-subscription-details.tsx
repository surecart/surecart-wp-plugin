import { Component, h, Prop, State, Watch } from '@stencil/core';
import { __, _n, sprintf } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

import apiFetch from '../../../../functions/fetch';
import { intervalString } from '../../../../functions/price';
import { BundleItem, License, Price, Product, Purchase, Subscription } from '../../../../types';
import { productNameWithPrice } from '../../../../functions/price';
import { formatNumber } from '../../../../../../admin/util';
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
  @State() bundleExpanded: boolean = false;

  renderName() {
    if (typeof this.subscription?.price?.product !== 'string') {
      return productNameWithPrice(this.subscription?.price);
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
        <span
          aria-label={sprintf(
            /* translators: %s: current period end date */
            __('Renewal Update - Your plan will be canceled on %s', 'surecart'),
            this.subscription.current_period_end_at_date,
          )}
        >
          {tag}{' '}
          {
            /* translators: %s: current period end date */
            sprintf(__('Your plan will be canceled on %s', 'surecart'), this.subscription.current_period_end_at_date)
          }
        </span>
      );
    }

    if (this.hasPendingUpdate) {
      if (!this.pendingPrice && !this.subscription?.pending_update?.ad_hoc_amount) {
        return <sc-skeleton></sc-skeleton>;
      }

      if (this.subscription?.pending_update?.ad_hoc_amount) {
        return (
          <span
            aria-label={sprintf(
              /* translators: 1: new price, 2: current period end date */
              __('Renewal Update - Your plan switches to %1s on %2s', 'surecart'),
              formatNumber(this.subscription?.pending_update?.ad_hoc_amount, this.pendingPrice?.currency || this.subscription?.price?.currency),
              this.subscription.current_period_end_at_date,
            )}
          >
            {__('Your plan switches to', 'surecart')}{' '}
            <strong>
              <sc-format-number
                type="currency"
                currency={this.pendingPrice?.currency || this.subscription?.price?.currency}
                value={this.subscription?.pending_update?.ad_hoc_amount}
              ></sc-format-number>{' '}
              {intervalString(this.pendingPrice || this.subscription?.price)}
            </strong>{' '}
            {__('on', 'surecart')} {this.subscription.current_period_end_at_date}
          </span>
        );
      }
      return (
        <span
          aria-label={sprintf(
            /* translators: 1: new plan name, 2: current period end date */
            __('Renewal Update - Your plan switches to %1s on %2s', 'surecart'),
            (this.pendingPrice.product as Product).name,
            this.subscription.current_period_end_at_date,
          )}
        >
          {__('Your plan switches to', 'surecart')} <strong>{(this.pendingPrice.product as Product).name}</strong> {__('on', 'surecart')}{' '}
          {this.subscription.current_period_end_at_date}
        </span>
      );
    }

    if (this?.subscription?.status === 'trialing' && this?.subscription?.trial_end_at) {
      return (
        <span
          aria-label={sprintf(
            /* translators: %s: trial end date */
            __('Renewal Update - Your plan begins on %s.', 'surecart'),
            this.subscription.trial_end_at_date,
          )}
        >
          {tag}{' '}
          {sprintf(
            /* translators: %s: trial end date */
            __('Your plan begins on %s', 'surecart'),
            this?.subscription?.trial_end_at_date,
          )}
        </span>
      );
    }
    if (this.subscription?.status === 'active' && this.subscription?.current_period_end_at) {
      return (
        <span
          aria-label={sprintf(
            /* translators: %s: current period end date */
            __('Renewal Update - Your next payment is on %s', 'surecart'),
            this.subscription.current_period_end_at_date,
          )}
        >
          {tag}{' '}
          {this.subscription?.remaining_period_count === null
            ? /* translators: %s: current period end date */
              sprintf(__('Your plan renews on %s', 'surecart'), this.subscription.current_period_end_at_date)
            : /* translators: %s: current period end date */
              sprintf(__('Your next payment is on %s', 'surecart'), this.subscription.current_period_end_at_date)}
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

  /**
   * Bundle items attached to the subscription's product (if it is a bundle).
   * Bundle is a Product attribute post-refactor — read it via price.product.
   */
  getBundleItems(): BundleItem[] {
    const product = (this.subscription?.price as Price)?.product as Product;
    if (!product?.bundle) return [];
    return (product?.bundle_items?.data || []) as BundleItem[];
  }

  renderBundleComponents() {
    const items = this.getBundleItems();
    if (!items.length) return null;

    return (
      <div>
        <button
          type="button"
          class="subscription-details__bundle-toggle"
          aria-expanded={this.bundleExpanded ? 'true' : 'false'}
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            this.bundleExpanded = !this.bundleExpanded;
          }}
        >
          <sc-icon name={this.bundleExpanded ? 'chevron-up' : 'chevron-down'}></sc-icon>
          {sprintf(
            /* translators: %d: number of bundle component items */
            _n('Includes %d item', 'Includes %d items', items.length, 'surecart'),
            items.length,
          )}
        </button>
        {this.bundleExpanded && (
          <div class="subscription-details__bundle-components">
            {items.map(item => {
              const itemProduct = item?.component_product as Product;
              return (
                <div class="subscription-details__bundle-component" key={item?.id}>
                  <sc-icon name="chevron-right" />
                  <span>{itemProduct?.name}</span>
                  {item?.quantity > 1 && (
                    <span class="subscription-details__bundle-qty">
                      {sprintf(
                        /* translators: %d: quantity */
                        __('× %d', 'surecart'),
                        item.quantity,
                      )}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  showWarning() {
    // no payment method.
    if (this.subscription?.payment_method || this.subscription?.manual_payment) {
      return false;
    }
    // don't show if not looking for payment.
    if (!['active', 'past_due', 'unpaid', 'incomplete'].includes(this.subscription?.status)) {
      return false;
    }
    // handle ad_hoc.
    if (this.subscription?.price?.ad_hoc) {
      return this.subscription?.ad_hoc_amount !== 0;
    }
    // show the warning if the subscription is not free.
    return this.subscription?.price?.amount !== 0;
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
          <sc-text
            aria-label={sprintf(
              /* translators: %s: plan name */
              __('Plan name - %s', 'surecart'),
              this.renderName(),
            )}
            style={{ '--font-weight': 'var(--sc-font-weight-bold)' }}
          >
            {this.renderName()}
          </sc-text>
          {this.renderActivations()}
        </sc-flex>

        {!this.hideRenewalText && <div>{this.renderRenewalText()} </div>}

        {this.renderBundleComponents()}

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
                    <sc-text style={{ '--color': 'var(--sc-color-gray-500)' }}>{activation?.created_at_date}</sc-text>
                  </sc-stacked-list-row>
                );
              })}
            </sc-stacked-list>
          </sc-card>
        </sc-dialog>

        {this.showWarning() && (
          <div>
            <sc-tag type="warning">
              <div class="subscription-details__missing-method">
                <sc-icon name="alert-triangle"></sc-icon>
                {__('Payment Method Missing', 'surecart')}
              </div>
            </sc-tag>
          </div>
        )}
      </div>
    );
  }
}
