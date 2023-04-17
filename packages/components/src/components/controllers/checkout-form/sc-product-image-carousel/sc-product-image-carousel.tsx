import { Component, Prop, State, h } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import Swiper from 'swiper';
import { addQueryArgs } from '@wordpress/url';
import { Media, ProductMedia } from 'src/types';
import apiFetch from '../../../../functions/fetch';

@Component({
  tag: 'sc-product-image-carousel',
  styleUrl: 'sc-product-image-carousel.scss',
  shadow: true,
})
export class ScProductImageCarousel {
  /** The product id. */
  @Prop() productId: string;

  @State() swiper?: Swiper;
  @State() swiperContainerRef?: HTMLDivElement;
  @State() thumbsSwiper?: Swiper;
  @State() swiperThumbsRef?: HTMLDivElement;
  /** Holds the products */
  @State() productMedias: Array<ProductMedia> = [];
  /** Loading */
  @State() loading: boolean = true;
  /** Current Slide Index */
  @State() currentSliderIndex: number = 0;

  /** Get all product medias */
  async getProductMedias() {
    if (!this.productId) return;
    this.loading = true;
    const medias = (await await apiFetch({
      path: addQueryArgs(`surecart/v1/product_medias/`, {
        product_ids: [this.productId],
        expand: ['media'],
      }),
    })) as ProductMedia[];
    this.productMedias = medias;
    this.loading = false;
  }

  componentDidLoad() {
    this.getProductMedias();
    if (this.swiperContainerRef) {
      this.swiper = new Swiper(this.swiperContainerRef, {
        direction: 'horizontal',
        loop: false,
        on: {
          slideChange: swiper => {
            this.currentSliderIndex = swiper.activeIndex;
          },
        },
      });
    }
    if (this.swiperThumbsRef) {
      this.thumbsSwiper = new Swiper(this.swiperThumbsRef, {
        direction: 'horizontal',
        loop: false,
        slidesPerView: 5,
        spaceBetween: 10,
      });
    }
  }

  render() {
    return (
      <div class={{ 'product-carousel__wrapper': true }}>
        <div
          class={{ swiper: true }}
          ref={el => {
            this.swiperContainerRef = el;
          }}
        >
          <div class={{ 'swiper-wrapper': true }}>
            {!this.loading ? (
              !!this.productMedias.length &&
              this.productMedias.map(media => (
                <div class={{ 'swiper-slide': true, 'product-carousel__slider': true }}>
                  <div class={{ 'swiper-slide-img': true }}>
                    <img src={(media?.media as Media)?.url ?? media?.url ?? ''} alt="" />
                  </div>
                </div>
              ))
            ) : (
              <sc-skeleton style={{ 'height': '310px', 'width': '100%', '--sc-border-radius-pill': '5px' }}></sc-skeleton>
            )}
          </div>
        </div>
        <div
          class={{ swiper: true }}
          style={{ marginTop: '16px' }}
          ref={el => {
            this.swiperThumbsRef = el;
          }}
        >
          <div class={{ 'swiper-wrapper': true }}>
            {!this.loading
              ? !!this.productMedias.length &&
                this.productMedias.map((thumb, index) => (
                  <div class={{ 'swiper-slide': true, 'product-carousel__thumb': true }}>
                    <div class={{ 'swiper-slide-img': true, '--is-active': this.currentSliderIndex === index }} onClick={() => this.swiper?.slideTo(index)}>
                      <img src={(thumb?.media as Media)?.url ?? thumb?.url ?? ''} alt="" />
                    </div>
                  </div>
                ))
              : null}
          </div>
        </div>
      </div>
    );
  }
}
