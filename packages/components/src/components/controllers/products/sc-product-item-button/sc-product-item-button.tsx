import { __ } from '@wordpress/i18n';
import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'sc-product-item-button',
  styleUrl: 'sc-product-item-button.scss',
  shadow: true,
})
export class ScProductItemButton {
  @Prop() size: 'large' | 'medium' | 'small' = 'small';

  @Prop() priceId: string;

  @Prop() formId: string;

  @Prop() mode: 'test' | 'live';

  @Prop() btnText: string;

  /** The button type. */
  @Prop({ reflect: true }) type: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'text' | 'link' = 'primary';

  render() {
    return (
      <Host>
        <div
          class={{
            'product-item-button': true,
          }}
        >
          <sc-cart-form price-id={this.priceId} form-id={this.formId} mode={this.mode}>
            <sc-cart-form-submit type={this.type} size={this.size}>
              {this.btnText ?? __('Add To Cart', 'surecart')}
            </sc-cart-form-submit>
          </sc-cart-form>
        </div>
      </Host>
    );
  }
}
