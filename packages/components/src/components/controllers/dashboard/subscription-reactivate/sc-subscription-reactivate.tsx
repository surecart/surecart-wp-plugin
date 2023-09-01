import { Component, Event, EventEmitter, Prop, State, h } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { Subscription } from 'src/types';
import apiFetch from '../../../../functions/fetch';

@Component({
  tag: 'sc-subscription-reactivate',
  styleUrl: 'sc-subscription-reactivate.scss',
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
      this.error = e?.message || __('Something went wrong', 'surecart');
    } finally {
      this.busy = false;
    }
  }

  render() {
    console.log(this.subscription);
    return (
      <sc-dialog noHeader open={this.open} style={{ '--width': '600px', '--body-spacing': 'var(--sc-spacing-xxx-large)' }}>
        <sc-dashboard-module heading={__('Resubscribe', 'surecart')} class="subscription-reactivate" error={this.error} style={{ '--sc-dashboard-module-spacing': '1em' }}>
          <div slot="description">
            <sc-alert open type="warning" title={__('Confirm Charge', 'surecart')}>
              {__('You will immediately be charged ', 'surecart')}
              <sc-format-number type="currency" value={this.subscription?.price?.amount} currency={this.subscription?.currency}></sc-format-number>
              {__(' for your subscription.', 'surecart')}
            </sc-alert>
            <sc-text
              style={{
                '--font-size': 'var(--sc-font-size-medium)',
                '--color': 'var(--sc-input-label-color)',
                '--line-height': 'var(--sc-line-height-dense)',
                'margin-top': 'var(--sc-spacing-medium)',
              }}
            >
              {__('Your subscription will be reactivated and will renew automatically on ', 'surecart')}
              <strong>
                <sc-format-date type="timestamp" date={this.subscription?.current_period_end_at as number} month="long" day="numeric" year="numeric"></sc-format-date>
              </strong>
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
          {this.busy && <sc-block-ui></sc-block-ui>}
        </sc-dashboard-module>
      </sc-dialog>
    );
  }
}
