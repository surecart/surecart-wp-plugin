import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'sc-product-image',
  styleUrl: 'sc-product-image.scss',
  shadow: true,
})
export class ScProductImage {
  /* Product image url */
  @Prop() src: string;

  /* Product image alt */
  @Prop() alt: string;

  /* Product image sizing */
  @Prop() sizing: 'cover' | 'contain';

  render() {
    console.log(this.src, !!this.src);

    return (
      <div
        class={{
          'product-img': true,
          'is_contained': this.sizing === 'contain',
          'is_covered': this.sizing === 'cover',
        }}
      >
        {!!this.src ? <img src={this.src} alt={this.alt} /> : <div class="product-img_placeholder" />}
      </div>
    );
  }
}
