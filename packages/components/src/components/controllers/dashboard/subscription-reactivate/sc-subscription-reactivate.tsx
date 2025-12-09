import { Component, Event, EventEmitter, Fragment, Prop, State, Watch, h } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { Checkout, Period, Subscription } from 'src/types';
import apiFetch from '../../../../functions/fetch';
import { addQueryArgs } from '@wordpress/url';

@Component({
  tag: 'sc-subscription-reactivate',
  shadow: true,
})
export class ScSubscriptionReactivate {
  /** Whether it is open */
  @Prop() open: boolean;

  /** The subscription to reactivate */
  @Prop() subscription: Subscription;

  /** Reactivate modal closed */
  @Event({ cancelable: true }) scRequestClose: EventEmitter<'close-button' | 'keyboard' | 'overlay'>;

  /** Refresh subscriptions */
  @Event() scRefresh: EventEmitter<void>;

  @State() busy: boolean;
  @State() error: string;
  @State() upcomingPeriod: Period;
  @State() loading: boolean = false;

  @Watch('open')
  openChanged() {
    if (this.open) {
      this.fetchUpcoming();
    }
  }

  async fetchUpcoming() {
    this.loading = true;
    try {
      this.upcomingPeriod = await apiFetch({
        method: 'PATCH',
        path: addQueryArgs(`surecart/v1/subscriptions/${this.subscription?.id}/upcoming_period`, {
          skip_product_group_validation: true,
          expand: ['period.checkout'],
        }),
        data: {
          purge_pending_update: false,
        },
      });
    } catch (e) {
      this.error = e?.additional_errors?.length ? e.additional_errors.map(err => err.message).join(', ') : e.message || __('Something went wrong', 'surecart');
    } finally {
      this.loading = false;
    }
  }

  async reactivateSubscription() {
    try {
      this.error = '';
      this.busy = true;
      await apiFetch({
        path: `surecart/v1/subscriptions/${this.subscription?.id}/restore`,
        method: 'PATCH',
      });
      this.scRefresh.emit();
      this.scRequestClose.emit('close-button');
    } catch (e) {
      this.error = e?.additional_errors?.length ? e.additional_errors.map(err => err.message).join(', ') : e.message || __('Something went wrong', 'surecart');
    } finally {
      this.busy = false;
    }
  }

  renderLoading() {
    return (
      <sc-flex flexDirection="column" style={{ gap: '1em' }}>
        <sc-skeleton style={{ width: '20%', display: 'inline-block' }}></sc-skeleton>
        <sc-skeleton style={{ width: '60%', display: 'inline-block' }}></sc-skeleton>
        <sc-skeleton style={{ width: '40%', display: 'inline-block' }}></sc-skeleton>
      </sc-flex>
    );
  }

  render() {
    return (
      <sc-dialog noHeader open={this.open} style={{ '--width': '600px', '--body-spacing': 'var(--sc-spacing-xxx-large)' }}>
        <sc-dashboard-module
          loading={this.loading}
          heading={__('Resubscribe', 'surecart')}
          class="subscription-reactivate"
          error={this.error}
          style={{ '--sc-dashboard-module-spacing': '1em' }}
        >
          {this.loading ? (
            this.renderLoading()
          ) : (
            <Fragment>
              <div slot="description">
                <sc-alert open type="warning" title={__('Confirm Charge', 'surecart')}>
                  {__('You will be charged', 'surecart')} {(this.upcomingPeriod?.checkout as Checkout)?.amount_due_display_amount}{' '}
                  {__('immediately for your subscription.', 'surecart')}
                </sc-alert>
                <sc-text
                  style={{
                    '--font-size': 'var(--sc-font-size-medium)',
                    '--color': 'var(--sc-input-label-color)',
                    '--line-height': 'var(--sc-line-height-dense)',
                    'margin-top': 'var(--sc-spacing-medium)',
                  }}
                >
                  {__('Your subscription will be reactivated and will renew automatically on', 'surecart')} <strong>{this.upcomingPeriod?.end_at_date}</strong>
                </sc-text>
              </div>
              <sc-flex justifyContent="flex-start">
                <sc-button type="primary" loading={this.busy} disabled={this.busy} onClick={() => this.reactivateSubscription()}>
                  {__('Yes, Reactivate', 'surecart')}
                </sc-button>
                <sc-button disabled={this.busy} style={{ color: 'var(--sc-color-gray-500)' }} type="text" onClick={() => this.scRequestClose.emit()}>
                  {__('No, Keep Inactive', 'surecart')}
                </sc-button>
              </sc-flex>
            </Fragment>
          )}
          {this.busy && <sc-block-ui></sc-block-ui>}
        </sc-dashboard-module>
      </sc-dialog>
    );
  }
}
