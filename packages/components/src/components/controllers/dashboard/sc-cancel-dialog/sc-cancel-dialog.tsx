import { Component, Event, EventEmitter, Fragment, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { Subscription, SubscriptionProtocol } from '../../../../types';

@Component({
  tag: 'sc-cancel-dialog',
  styleUrl: 'sc-cancel-dialog.scss',
  shadow: true,
})
export class ScCancelDialog {
  @Prop() open: boolean;
  @Prop() protocol: SubscriptionProtocol;
  @Prop() subscription: Subscription;
  @Event({ cancelable: true }) scRequestClose: EventEmitter<'close-button' | 'keyboard' | 'overlay'>;

  renderContent() {
    return <sc-subscription-cancel subscription={this.subscription} protocol={this.protocol} onScRequestClose={e => this.scRequestClose.emit(e.detail)} />;
    // if (!this.protocol.preservation_enabled) {
    //   return this.renderCancel();
    // }

    // return this.renderSurvey();
  }

  renderSurvey() {
    return (
      <Fragment>
        <sc-button type="primary">{__('Continue', 'surecart')}</sc-button>
      </Fragment>
    );
  }

  renderCancel() {
    return 'cancel';
  }

  render() {
    return (
      <sc-dialog noHeader open={this.open} onScRequestClose={e => this.scRequestClose.emit(e.detail)} style={{ '--body-spacing': 'var(--sc-spacing-xx-large)' }}>
        <div
          class={{
            cancel: true,
          }}
        >
          <sc-button class="close__button" type="text" circle onClick={() => this.scRequestClose.emit('close-button')}>
            <sc-icon name="x" />
          </sc-button>
          {this.renderContent()}
        </div>
      </sc-dialog>
    );
  }
}
