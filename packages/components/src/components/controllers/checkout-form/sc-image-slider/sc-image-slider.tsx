import { Component, Prop, State, Watch, h } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import Swiper, { Navigation } from 'swiper';

const THUMBS_PER_PAGE = 5;

@Component({
  tag: 'sc-image-slider',
  styleUrl: 'sc-image-slider.scss',
  shadow: true,
})
export class ScImageSlider {
  private swiperThumbsRef?: HTMLDivElement;
  private swiperContainerRef?: HTMLDivElement;
  private previous: HTMLDivElement;
  private next: HTMLDivElement;

  @Prop() images: { src: string; alt: string }[] = [];
  @Prop() thumbnails: boolean;

  @State() swiper?: Swiper;
  @State() thumbsSwiper?: Swiper;

  /** Current Slide Index */
  @State() currentSliderIndex: number = 0;

  @Watch('currentSliderIndex')
  handleThumbPaginate() {
    if (!this.thumbsSwiper) return;
    const slideInView = this.currentSliderIndex >= this.thumbsSwiper.activeIndex && this.currentSliderIndex < this.thumbsSwiper.activeIndex + THUMBS_PER_PAGE;
    if (!slideInView) {
      this.thumbsSwiper.slideTo(this.currentSliderIndex);
    }
  }

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
        modules: [Navigation],
        direction: 'horizontal',
        loop: false,
        slidesPerView: THUMBS_PER_PAGE,
        slidesPerGroup: THUMBS_PER_PAGE,
        spaceBetween: 10,
        navigation: {
          nextEl: this.next,
          prevEl: this.previous,
        },
      });
    }
  }

  render() {
    return (
      <div class="product-carousel" part="base">
        <div class="swiper" ref={el => (this.swiperContainerRef = el)}>
          <div class="swiper-wrapper">
            {(this.images || []).map(({ src, alt }, index) => (
              <div key={index} class="swiper-slide product-carousel__slider">
                <div class="swiper-slide-img">
                  <img src={src} alt={alt} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {this.thumbnails && (
          <div class={{ 'product-carousel__thumbs': true, 'product-carousel__thumbs--has-navigation': this.images.length > 5 }}>
            <div class="product-carousel__navigation product-carousel--is-prev" ref={el => (this.previous = el)}>
              <sc-icon name="chevron-left" />
            </div>

            <div class="swiper" ref={el => (this.swiperThumbsRef = el)}>
              <div class="swiper-wrapper">
                {!!this.images.length &&
                  this.images.map(({ src, alt }, index) => (
                    <div class="swiper-slide product-carousel__thumb">
                      <div class={{ 'swiper-slide-img': true, 'swiper-slide-img--is-active': this.currentSliderIndex === index }} onClick={() => this.swiper?.slideTo(index)}>
                        <img src={src} alt={alt} />
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div class="product-carousel__navigation product-carousel--is-next" ref={el => (this.next = el)}>
              <sc-icon name="chevron-right" />
            </div>
          </div>
        )}
      </div>
    );
  }
}
