import { Component, Event, EventEmitter, Fragment, h, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../../functions/fetch';
import { CancellationReason, SubscriptionProtocol } from '../../../../types';
import { Subscription } from '../../../../types';
@Component({
  tag: 'sc-subscription-cancel',
  styleUrl: 'sc-subscription-cancel.scss',
  shadow: true,
})
export class ScSubscriptionCancel {
  @Prop() heading: string;
  @Prop() backUrl: string;
  @Prop() successUrl: string;
  @Prop() subscription: Subscription;
  @Prop() protocol: SubscriptionProtocol;
  @Prop() reason: CancellationReason;
  @Prop() comment: string;
  @State() loading: boolean;
  @State() busy: boolean;
  @State() error: string;
  @Event() scAbandon: EventEmitter<void>;
  @Event() scCancelled: EventEmitter<void>;

  async cancelSubscription() {
    try {
      this.error = '';
      this.busy = true;
      await apiFetch({
        path: addQueryArgs(`/surecart/v1/subscriptions/${this.subscription?.id}/cancel`, {
          cancellation_act: {
            ...(!!this.comment ? { comment: this.comment } : {}),
            cancellation_reason_id: this.reason?.id,
          },
        }),
        method: 'PATCH',
      });
      this.scCancelled.emit();
    } catch (e) {
      this.error = e?.message || __('Something went wrong', 'surecart');
      this.busy = false;
    }
  }

  renderContent() {
    if (this.loading) {
      return this.renderLoading();
    }

    return (
      <Fragment>
        {this?.protocol?.cancel_behavior === 'pending' ? (
          <Fragment>
            {__('Your plan will be canceled, but is still available until the end of your billing period on', 'surecart')}{' '}
            <strong>{this?.subscription?.current_period_end_at_date}</strong>. {__('If you change your mind, you can renew your subscription.', 'surecart')}
          </Fragment>
        ) : (
          <Fragment>{__('Your plan will be canceled immediately and cannot be modified later.', 'surecart')}</Fragment>
        )}
      </Fragment>
    );
  }

  renderLoading() {
    return (
      <div style={{ padding: '0.5em' }}>
        <sc-skeleton style={{ width: '30%', marginBottom: '0.75em' }}></sc-skeleton>
        <sc-skeleton style={{ width: '20%', marginBottom: '0.75em' }}></sc-skeleton>
        <sc-skeleton style={{ width: '40%' }}></sc-skeleton>
      </div>
    );
  }

  render() {
    let heading = this.heading || __('Cancel your plan', 'surecart');
    let cancelButtonText = __('Cancel Plan', 'surecart');
    let keepButtonText = __('Keep My Plan', 'surecart');
    let content = this.renderContent();

    if (window?.wp?.hooks?.applyFilters) {
      heading = window.wp.hooks.applyFilters('surecart_dashboard_subscription_cancel_popup_heading', heading, this?.subscription) as string;
      cancelButtonText = window.wp.hooks.applyFilters('surecart_dashboard_subscription_cancel_popup_cancel_button_text', cancelButtonText, this?.subscription) as string;
      keepButtonText = window.wp.hooks.applyFilters('surecart_dashboard_subscription_cancel_popup_keep_button_text', keepButtonText, this?.subscription) as string;
      content = window.wp.hooks.applyFilters('surecart_dashboard_subscription_cancel_popup_content', content, this?.subscription);
    }

    return (
      <sc-dashboard-module heading={heading} class="subscription-cancel" error={this.error} style={{ '--sc-dashboard-module-spacing': '1em' }}>
        <div slot="description">
          {content}
          <slot name="cancel-popup-content"></slot>
        </div>
        <sc-flex justifyContent="flex-start">
          <sc-button type="primary" loading={this.loading || this.busy} disabled={this.loading || this.busy} onClick={() => this.cancelSubscription()}>
            {cancelButtonText}
          </sc-button>

          <sc-button
            type="text"
            onClick={() => this.scAbandon.emit()}
            loading={this.loading || this.busy}
            disabled={this.loading || this.busy}
          >
            {keepButtonText}
          </sc-button>
        </sc-flex>

        {this.busy && <sc-block-ui></sc-block-ui>}
      </sc-dashboard-module>
    );
  }
}
