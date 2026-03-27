import { Component, Event, EventEmitter, h, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

import apiFetch from '../../../../functions/fetch';
import { CancellationReason, ResponseError, Subscription, SubscriptionProtocol } from '../../../../types';
import { getCurrentBehaviourContent } from './functions';

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

  hasDiscount() {
    return !!this.subscription?.discount?.id;
  }

  render() {
    const { title, description, button, cancel_link } = getCurrentBehaviourContent(this.protocol, this.subscription?.discount?.id);
    return (
      <div class="cancel-discount">
        <sc-dashboard-module heading={title} style={{ '--sc-dashboard-module-spacing': '2em' }}>
          <span slot="description">{description}</span>
          <sc-flex justifyContent="flex-start">
            <sc-button type="primary" onClick={() => this.addDiscount()}>
              {button}
            </sc-button>
            <sc-button class="cancel-discount__abort-link" type="text" onClick={() => this.scCancel.emit()}>
              {cancel_link}
            </sc-button>
          </sc-flex>
          {!!this.loading && <sc-block-ui spinner />}
        </sc-dashboard-module>
      </div>
    );
  }
}
