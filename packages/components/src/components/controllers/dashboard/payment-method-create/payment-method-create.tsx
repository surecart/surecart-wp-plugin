import { Component, Element, h, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';

@Component({
  tag: 'sc-payment-method-create',
  styleUrl: 'payment-method-create.scss',
  shadow: false,
})
export class ScPaymentMethodCreate {
  @Element() el: HTMLElement;
  @Prop() error: string;
  @Prop() clientSecret: string;
  @Prop() successUrl: string;

  @State() loading: boolean = false;

  /**
   * Handle form submission.
   */
  async handleSubmit() {
    const element = this.el.querySelector('sc-stripe-element') as HTMLScStripeElementElement;
    if (!element || !this.clientSecret) {
      this.error = __('Something went wrong', 'surecart');
      return;
    }
    this.loading = true;
    try {
      await element.confirmCardSetup(this.clientSecret);
      if (this.successUrl) {
        window.location.assign(this.successUrl);
      } else {
        this.loading = false;
      }
    } catch (e) {
      this.error = e?.message || __('Something went wrong', 'surecart');
      this.loading = false;
    }
  }

  render() {
    return (
      <sc-card>
        <sc-form onScFormSubmit={() => this.handleSubmit()}>
          {this.error && (
            <sc-alert open={!!this.error} type="danger">
              <span slot="title">{__('Error', 'surecart')}</span>
              {this.error}
            </sc-alert>
          )}

          <slot />

          <sc-button type="primary" submit full loading={this.loading}>
            {__('Save Payment Method', 'surecart')}
          </sc-button>

          {this.loading && <sc-block-ui></sc-block-ui>}
        </sc-form>
      </sc-card>
    );
  }
}
