import { Component, Event, EventEmitter, h, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import apiFetch from '../../../../functions/fetch';

import { CancellationReason, Subscription, SubscriptionProtocol } from '../../../../types';

@Component({
  tag: 'sc-cancel-dialog',
  styleUrl: 'sc-cancel-dialog.scss',
  shadow: true,
})
export class ScCancelDialog {
  @Prop() open: boolean;
  @Prop() protocol: SubscriptionProtocol;
  @Prop() subscription: Subscription;
  @State() reasons: CancellationReason[];
  @State() reason: CancellationReason;
  @State() step: 'cancel' | 'survey' | 'discount' | 'discount-complete' = 'cancel';
  @State() comment: string;
  @Event({ cancelable: true }) scRequestClose: EventEmitter<'close-button' | 'keyboard' | 'overlay'>;
  @Event() scRefresh: EventEmitter<void>;

  close() {
    this.reset();
    this.trackAttempt();
    this.scRequestClose.emit('close-button');
  }

  reset() {
    this.reason = null;
    this.step = this.protocol.preservation_enabled ? 'survey' : 'cancel';
  }

  async trackAttempt() {
    if (!this.protocol.preservation_enabled) return;
    await apiFetch({
      method: 'PATCH',
      path: `surecart/v1/subscriptions/${this.subscription?.id}/preserve`,
    });
  }

  componentWillLoad() {
    this.reset();
  }

  render() {
    return (
      <sc-dialog
        style={{
          '--width': this.step === 'survey' ? '675px' : '500px',
          '--body-spacing': 'var(--sc-spacing-xxx-large)',
        }}
        noHeader
        open={this.open}
        onScRequestClose={() => this.close()}
      >
        <div
          class={{
            cancel: true,
          }}
        >
          <sc-button class="close__button" type="text" circle onClick={() => this.close()}>
            <sc-icon name="x" />
          </sc-button>

          {this.step === 'cancel' && (
            <sc-subscription-cancel
              subscription={this.subscription}
              protocol={this.protocol}
              reason={this.reason}
              comment={this.comment}
              onScAbandon={() => this.close()}
              onScCancelled={() => {
                this.scRefresh.emit();
                this.reset();
                this.scRequestClose.emit('close-button');
              }}
            />
          )}

          {this.step === 'survey' && (
            <sc-cancel-survey
              protocol={this.protocol}
              onScAbandon={() => this.close()}
              onScSubmitReason={e => {
                const { comment, reason } = e.detail;
                this.reason = reason;
                this.comment = comment;
                this.step = reason?.coupon_enabled ? 'discount' : 'cancel';
              }}
            />
          )}

          {this.step === 'discount' && (
            <sc-cancel-discount
              protocol={this.protocol}
              subscription={this.subscription}
              reason={this.reason}
              comment={this.comment}
              onScCancel={() => (this.step = 'cancel')}
              onScPreserved={() => {
                this.scRefresh.emit();
                this.reset();
                this.scRequestClose.emit('close-button');
              }}
            />
          )}
        </div>
      </sc-dialog>
    );
  }
}
