import { Component, h, Host, Prop } from '@stencil/core';
import { FeaturedProductMediaAttributes } from '../../../../types';
import { sizeImage } from '../../../../functions/media';
import { applyFilters } from '@wordpress/hooks';

@Component({
  tag: 'sc-product-item-image',
  styleUrl: 'sc-product-item-image.scss',
  shadow: true,
})
export class ScProductItemImage {
  /* Product Media */
  @Prop() productMedia: FeaturedProductMediaAttributes;

  /* Product image sizing */
  @Prop() sizing: 'cover' | 'contain';

  getSrc() {
    if (this.productMedia?.url) {
      return this.productMedia?.url;
    }

    if (this.productMedia.url) {
      return sizeImage(this.productMedia.url, applyFilters('surecart/product-list/media/size', 900));
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
          {!!this.getSrc() ? (
            <img src={this.getSrc()} alt={this.productMedia.alt} {...(this.productMedia.title ? { title: this.productMedia.title } : {})} />
          ) : (
            <div class="product-img_placeholder" />
          )}
        </div>
      </Host>
    );
  }
}
