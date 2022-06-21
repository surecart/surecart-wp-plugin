import { Component, h, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { intervalString } from '../../../../functions/price';
import { Price } from '../../../../types';

@Component({
  tag: 'sc-subscription-ad-hoc-confirm',
  styleUrl: 'sc-subscription-ad-hoc-confirm.scss',
  shadow: false,
})
export class ScSubscriptionAdHocConfirm {
  @Prop() heading: string;
  @Prop() price: Price;
  @State() busy: boolean = false;

  async handleSubmit(e) {
    const { ad_hoc_amount } = await e.target.getFormJson();

    this.busy = true;
    return window.location.assign(
      addQueryArgs(window.location.href, {
        action: 'confirm',
        ad_hoc_amount,
      }),
    );
  }

  render() {
    return (
      <sc-dashboard-module heading={this.heading || __('Enter An Amount', 'surecart')} class="subscription-switch">
        <sc-card>
          <sc-form onScSubmit={e => this.handleSubmit(e)}>
            <sc-price-input label="Amount" name="ad_hoc_amount" autofocus required>
              <span slot="suffix" style={{ opacity: '0.75' }}>
                {intervalString(this.price)}
              </span>
            </sc-price-input>
            <sc-button type="primary" full submit loading={this.busy}>
              {__('Next', 'surecart')} <sc-icon name="arrow-right" slot="suffix"></sc-icon>
            </sc-button>
          </sc-form>
        </sc-card>
        {this.busy && <sc-block-ui style={{ zIndex: '9' }}></sc-block-ui>}
      </sc-dashboard-module>
    );
  }
}
