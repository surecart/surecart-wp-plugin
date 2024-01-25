import { Component, Event, EventEmitter, h, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

import apiFetch from '../../../../functions/fetch';
import { CancellationReason, ResponseError, Subscription, SubscriptionProtocol } from '../../../../types';
import { getCurrentBehaviourTitle } from './functions';

@Component({
  tag: 'sc-cancel-discount',
  styleUrl: 'sc-cancel-discount.scss',
  shadow: true,
})
export class ScCancelDiscount {
  @Prop() subscription: Subscription;
  @Prop() reason: CancellationReason;
  @Prop() comment: string;
  @Prop() protocol: SubscriptionProtocol;
  @Event() scCancel: EventEmitter<void>;
  @Event() scPreserved: EventEmitter<void>;
  @State() loading: boolean;
  @State() error: ResponseError;

  async addDiscount() {
    try {
      this.loading = true;
      this.subscription = (await apiFetch({
        method: 'PATCH',
        path: addQueryArgs(`surecart/v1/subscriptions/${this.subscription?.id}/preserve`, {
          cancellation_act: {
            ...(!!this.comment ? { comment: this.comment } : {}),
            cancellation_reason_id: this.reason?.id,
          },
        }),
      })) as Subscription;
      this.scPreserved.emit();
    } catch (e) {
      console.error(e);
      this.error = e;
    } finally {
      this.loading = false;
    }
  }

  render() {
    return (
      <div class="cancel-discount">
        <sc-dashboard-module heading={getCurrentBehaviourTitle(this.subscription, this.protocol, 'title')} style={{ '--sc-dashboard-module-spacing': '2em' }}>
          <span slot="description">{getCurrentBehaviourTitle(this.subscription, this.protocol, 'description')}</span>
          <sc-flex justifyContent="flex-start">
            <sc-button type="primary" onClick={() => this.addDiscount()}>
              {getCurrentBehaviourTitle(this.subscription, this.protocol, 'button')}
            </sc-button>
            <sc-button class="cancel-discount__abort-link" type="text" onClick={() => this.scCancel.emit()}>
              {getCurrentBehaviourTitle(this.subscription, this.protocol, 'cancel_link')}
            </sc-button>
          </sc-flex>
          {!!this.loading && <sc-block-ui spinner />}
        </sc-dashboard-module>
      </div>
    );
  }
}
