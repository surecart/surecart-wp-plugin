import { Component, h, Host, Prop } from '@stencil/core';
import { Media, ProductMedia } from '../../../../types';
import { sizeImage } from '../../../../functions/media';
import { applyFilters } from '@wordpress/hooks';

@Component({
  tag: 'sc-product-item-image',
  styleUrl: 'sc-product-item-image.scss',
  shadow: true,
})
export class ScProductItemImage {
  /* Product image url */
  @Prop() productMedia: ProductMedia;

  /* Product image alt */
  @Prop() alt: string;

  /* Product image sizing */
  @Prop() sizing: 'cover' | 'contain';

  getSrc() {
    if (this.productMedia?.url) {
      return this.productMedia?.url;
    }

    if ((this.productMedia?.media as Media)?.url) {
      return sizeImage((this.productMedia?.media as Media)?.url, applyFilters('surecart/product-list/media/size', 800));
    }

    return '';
  }

  render() {
    return (
      <Host style={{ borderStyle: 'none' }}>
        <div
          class={{
            'product-img': true,
            'is_contained': this.sizing === 'contain',
            'is_covered': this.sizing === 'cover',
          }}
        >
          {!!this.getSrc() ? <img src={this.getSrc()} alt={this.alt} /> : <div class="product-img_placeholder" />}
        </div>
      </Host>
    );
  }
}
