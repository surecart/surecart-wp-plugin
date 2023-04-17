import { Component, Prop, State, h } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import Swiper from 'swiper';

@Component({
  tag: 'sc-product-image-carousel',
  styleUrl: 'sc-product-image-carousel.scss',
  shadow: true,
})
export class ScProductImageCarousel {
  @Prop() images: { src: string; alt: string }[] = [];
  @State() swiper?: Swiper;
  @State() swiperContainerRef?: HTMLDivElement;
  @State() thumbsSwiper?: Swiper;
  @State() swiperThumbsRef?: HTMLDivElement;

  /** Current Slide Index */
  @State() currentSliderIndex: number = 0;

  componentDidLoad() {
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
            {!!this.images.length &&
              this.images.map(({ src, alt }, index) => (
                <div key={index} class={{ 'swiper-slide': true, 'product-carousel__slider': true }}>
                  <div class={{ 'swiper-slide-img': true }}>
                    <img src={src} alt={alt} />
                  </div>
                </div>
              ))}
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
            {!!this.images.length &&
              this.images.map(({ src, alt }, index) => (
                <div class={{ 'swiper-slide': true, 'product-carousel__thumb': true }}>
                  <div class={{ 'swiper-slide-img': true, '--is-active': this.currentSliderIndex === index }} onClick={() => this.swiper?.slideTo(index)}>
                    <img src={src} alt={alt} />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }
}
