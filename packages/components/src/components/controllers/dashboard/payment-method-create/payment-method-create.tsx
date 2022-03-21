import { Component, Element, h, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';

@Component({
  tag: 'ce-payment-method-create',
  styleUrl: 'payment-method-create.scss',
  shadow: false,
})
export class CePaymentMethodCreate {
  @Element() el: HTMLElement;
  @Prop() error: string;
  @Prop() clientSecret: string;
  @Prop() successUrl: string;

  @State() loading: boolean = false;

  /**
   * Handle form submission.
   */
  async handleSubmit() {
    const element = this.el.querySelector('ce-stripe-element') as HTMLCeStripeElementElement;
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
      <ce-card>
        <ce-form onCeFormSubmit={() => this.handleSubmit()}>
          {this.error && (
            <ce-alert open={!!this.error} type="danger">
              <span slot="title">{__('Error', 'surecart')}</span>
              {this.error}
            </ce-alert>
          )}

          <slot />

          <ce-button type="primary" submit full loading={this.loading}>
            {__('Save Payment Method', 'surecart')}
          </ce-button>

          {this.loading && <ce-block-ui></ce-block-ui>}
        </ce-form>
      </ce-card>
    );
  }
}
