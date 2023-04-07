import { Component, h, Prop } from '@stencil/core';
import { Product } from '../../../../types';
import { LayoutConfig } from '../sc-product-item-list/sc-product-item-list';

@Component({
  tag: 'sc-product-item',
  styleUrl: 'sc-product-item.scss',
  shadow: true,
})
export class ScProductItem {
  /* Product */
  @Prop() product: Product;

  /* Product Layout Config */
  @Prop() layoutConfig: LayoutConfig;

  render() {
    return (
      <a href={this.product?.permalink} class={{ 'product-item': true }}>
        {this.product &&
          this.layoutConfig.map(layout => {
            switch (layout.blockName) {
              case 'surecart/product-item-title':
                return <sc-product-item-title>{this.product?.name}</sc-product-item-title>;

              case 'surecart/product-item-image':
                return <sc-product-item-image src={this.product?.image_url} sizing={layout.attributes?.sizing}></sc-product-item-image>;

              case 'surecart/product-item-price':
                return <sc-product-item-price prices={this.product?.prices.data}></sc-product-item-price>;

              default:
                return null;
            }
          })}
      </a>
    );
  }
}
