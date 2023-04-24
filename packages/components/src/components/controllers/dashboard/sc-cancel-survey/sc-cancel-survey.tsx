import { Component, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import apiFetch from '../../../../functions/fetch';
import { CancellationReason, ResponseError, SubscriptionProtocol } from '../../../../types';

@Component({
  tag: 'sc-cancel-survey',
  styleUrl: 'sc-cancel-survey.scss',
  shadow: true,
})
export class ScCancelSurvey {
  private textArea: HTMLScTextareaElement;
  @Prop() protocol: SubscriptionProtocol;
  @Prop({ mutable: true }) reasons: CancellationReason[];
  @State() loading: boolean;
  @State() selectedReason: CancellationReason;
  @State() comment: string;
  @State() error: ResponseError;
  @Event() scAbandon: EventEmitter<void>;
  @Event() scSubmitReason: EventEmitter<{ reason: CancellationReason; comment: string }>;

  componentWillLoad() {
    if (!this.reasons) {
      this.fetchReasons();
    }
  }

  @Watch('selectedReason')
  handleSelectedReasonChange() {
    if (this.selectedReason?.comment_enabled) {
      setTimeout(() => {
        this.textArea.triggerFocus();
      }, 50);
    }
  }

  async fetchReasons() {
    try {
      this.loading = true;
      this.reasons = await apiFetch({
        path: 'surecart/v1/cancellation_reasons',
      });
    } catch (e) {
      console.error(e);
      this.error = e;
    } finally {
      this.loading = false;
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    try {
      this.scSubmitReason.emit({ reason: this.selectedReason, comment: this.comment });
    } catch (e) {
      console.error(e);
      this.error = e;
    }
  }

  renderReasons() {
    if (this.loading) {
      return (
        <sc-choice>
          <sc-skeleton></sc-skeleton>
        </sc-choice>
      );
    }

    return (this.reasons || []).map(reason => (
      <sc-choice
        value={reason?.id}
        name="reason"
        onScChange={e => {
          if (e.target.checked) {
            this.selectedReason = reason;
          }
        }}
      >
        {reason?.label}
      </sc-choice>
    ));
  }

  render() {
    const { reasons_title, reasons_description, skip_link } = this.protocol?.preservation_locales || {};

    if (this.loading) {
      return <sc-skeleton></sc-skeleton>;
    }

    return (
      <div class="cancel-survey">
        <sc-dashboard-module heading={reasons_title} style={{ '--sc-dashboard-module-spacing': '2em' }}>
          <span slot="description">{reasons_description}</span>
          <sc-form onScSubmit={e => this.handleSubmit(e)} style={{ '--sc-form-row-spacing': '2em' }}>
            <sc-choices showLabel={false} label={__('Choose a reason', 'surecart')} style={{ '--columns': '2' }} required>
              {this.renderReasons()}
            </sc-choices>
            {this.selectedReason?.comment_enabled && (
              <sc-textarea
                label={this.selectedReason?.comment_prompt || __('Additional Comments', 'surecart')}
                required
                ref={el => (this.textArea = el as HTMLScTextareaElement)}
                onScInput={e => (this.comment = e.target.value)}
              ></sc-textarea>
            )}
            <sc-flex justifyContent="flex-start">
              <sc-button type="primary" submit>
                {__('Continue', 'surecart')}
                <sc-icon name="arrow-right" slot="suffix" />
              </sc-button>
              {!!skip_link && (
                <sc-button class="cancel-survey__abort-link" type="text" onClick={() => this.scAbandon.emit()}>
                  {skip_link}
                </sc-button>
              )}
            </sc-flex>
          </sc-form>
        </sc-dashboard-module>
      </div>
    );
  }
}
