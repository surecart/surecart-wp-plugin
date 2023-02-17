import { Component, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { state } from '../../../../store/buy';
import { Product } from '../../../../types';

@Component({
  tag: 'sc-product-buy-page',
  styleUrl: 'sc-product-buy-page.css',
  shadow: true,
})
export class ScProductBuyPage {
  @Prop() product: Product;
  @Prop()
  componentWillLoad() {
    console.log(this.product);
    state.product = this.product;
  }

  render() {
    return (
      <div part="base">
        <sc-checkout>
          <sc-form>
            <sc-columns is-stacked-on-mobile is-full-height style={{ backgroundColor: 'var(--sc-color-gray-100)' }}>
              <sc-column
                class="wp-block-surecart-column is-layout-constrained is-horizontally-aligned-right"
                style={{ 'padding': '60px', '--sc-column-content-width': '450px', '--sc-form-row-spacing': '30px', 'background': '#fff' }}
              >
                <sc-input label={__('Email Address', 'surecart')} type="email" />
                <sc-input label={__('Name', 'surecart')} type="text" />
                <sc-button type="primary" submit full>
                  {__('Purchase', 'surecart')}
                </sc-button>
              </sc-column>
              <sc-column
                class="wp-block-surecart-column is-sticky is-layout-constrained is-horizontally-aligned-left hydrated"
                style={{ 'padding': '60px', '--sc-column-content-width': '450px', '--sc-form-row-spacing': '30px' }}
              >
                <h1>{state?.product?.name}</h1>
                {!!state?.product?.description && <p>{state?.product?.description}</p>}
              </sc-column>
            </sc-columns>
          </sc-form>
        </sc-checkout>
      </div>
    );
  }
}
