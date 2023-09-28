import { Component, h, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { Product, Subscription, Price } from '../../../../types';
import { getVariantFromValues } from '../../../../functions/util';

@Component({
  tag: 'sc-subscription-variation-confirm',
  styleUrl: 'sc-subscription-variation-confirm.scss',
  shadow: false,
})
export class ScSubscriptionVariationConfirm {
  @Prop() heading: string;
  @Prop() product: Product;
  @Prop() price: Price;
  @Prop() subscription: Subscription;
  @State() busy: boolean = false;
  @State() variantValues: Array<string> = [];

  constructor() {
    // Bind the submit function to the component instance
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillLoad() {
    this.variantValues = this.subscription?.variant_options;
  }
  
  async handleSubmit() {
    this.busy = true;
    
    const selectedVariant = getVariantFromValues({ variants: this.product?.variants?.data, values: this.variantValues });
    
    // confirm ad_hoc amount.
    if (this.price?.ad_hoc) {
      return window.location.assign(
        addQueryArgs(window.location.href, {
          action: 'confirm_amount',
          price_id: this.price?.id,
          variant: selectedVariant?.id,
        }),
      );
    }

    return window.location.assign(
      addQueryArgs(window.location.href, {
        action: 'confirm',
        variant: selectedVariant?.id,
      }),
    );
  }

  buttonText() {
    if (this.price?.ad_hoc) {
      if (this.price?.id === (this.subscription?.price as Price)?.id) {
        return __('Update Amount', 'surecart');
      }
      return __('Choose Amount', 'surecart');
    }
    return __('Next', 'surecart');
  }
  render() {
    return (
      <sc-dashboard-module heading={this.heading || __('Enter An Amount', 'surecart')} class="subscription-switch">
        <sc-card>
          <sc-form onScSubmit={this.handleSubmit}>
            <div class="sc-product-variation-choice-wrap">
              {(this.product?.variant_options?.data || []).map(({name, values, id }, index) => {
                return (
                  <sc-select
                    exportparts="base:select__base, input, form-control, label, help-text, trigger, panel, caret, menu__base, spinner__base, empty"
                    part="name__input"
                    value={this.subscription?.variant_options?.[index] || ''}
                    onScChange={(e: any) => {
                      this.variantValues[index] = e.detail.value;
                    }}
                    label={name}
                    choices={values?.map(label => ({
                      label,
                      value: label,
                    }))}
                    unselect={false}
                    key={id}
                  />
                );
              })}
            </div>
            <sc-button type="primary" full submit loading={this.busy}>
              {this.buttonText()} <sc-icon name="arrow-right" slot="suffix"></sc-icon>
            </sc-button>
          </sc-form>
        </sc-card>
        {this.busy && <sc-block-ui style={{ zIndex: '9' }}></sc-block-ui>}
      </sc-dashboard-module>
    );
  }
}
