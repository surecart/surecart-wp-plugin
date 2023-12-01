import { Component, h, Host, Prop } from '@stencil/core';
import { Media, Product, ProductMedia } from '../../../../types';
import { sizeImage } from '../../../../functions/media';
import { applyFilters } from '@wordpress/hooks';
import { getFeaturedProductMediaAttributes } from 'src/functions/media';

@Component({
  tag: 'sc-product-item-image',
  styleUrl: 'sc-product-item-image.scss',
  shadow: true,
})
export class ScProductItemImage {
  /* Product image url */
  @Prop() product: Product;

  /* Product image sizing */
  @Prop() sizing: 'cover' | 'contain';

  getSrc() {
    if ((this.product?.featured_product_media as ProductMedia)?.url) {
      return (this.product?.featured_product_media as ProductMedia)?.url;
    }

    if (((this.product?.featured_product_media as ProductMedia)?.media as Media)?.url) {
      return sizeImage(((this.product?.featured_product_media as ProductMedia)?.media as Media)?.url, applyFilters('surecart/product-list/media/size', 900));
    }

    return '';
  }

  render() {
    const { alt, title } = getFeaturedProductMediaAttributes(this.product);
    return (
      <Host style={{ borderStyle: 'none' }}>
        <div
          class={{
            'product-img': true,
            'is_contained': this.sizing === 'contain',
            'is_covered': this.sizing === 'cover',
          }}
        >
          {!!this.getSrc() ? <img src={this.getSrc()} alt={alt} {...(title ? { title } : {})} /> : <div class="product-img_placeholder" />}
        </div>
      </Host>
    );
  }
}
