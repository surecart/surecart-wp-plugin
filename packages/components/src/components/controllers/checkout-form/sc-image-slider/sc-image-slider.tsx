import { Component, Prop, State, Watch, h } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import Swiper, { Navigation } from 'swiper';

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
  private swiper: Swiper;
  private thumbsSwiper: Swiper;

  /** Accept a string or an array of objects */
  @Prop() images: string | { src: string; alt: string }[];
  @Prop() thumbnails: boolean;
  @Prop() thumbnailsPerPage: number = 5;
  @Prop() autoHeight: boolean;

  /** Current Slide Index */
  @State() currentSliderIndex: number = 0;
  @State() imagesData: { src: string; alt: string }[] = [];

  @Watch('currentSliderIndex')
  handleThumbPaginate() {
    if (!this.thumbsSwiper) return;
    const slideInView = this.currentSliderIndex >= this.thumbsSwiper.activeIndex && this.currentSliderIndex < this.thumbsSwiper.activeIndex + this.thumbnailsPerPage;
    if (!slideInView) {
      this.thumbsSwiper.slideTo(this.currentSliderIndex);
    }
  }

  @Watch('images')
  parseImages(newValue: string | { src: string; alt: string }[]) {
    if (newValue) this.imagesData = typeof newValue == 'string' ? JSON.parse(newValue) : newValue;
  }

  componentWillLoad() {
    this.parseImages(this.images);
  }

  componentDidLoad() {
    if (this.swiperContainerRef) {
      this.swiper = new Swiper(this.swiperContainerRef, {
        direction: 'horizontal',
        loop: false,
        autoHeight: this.autoHeight,
        centeredSlides: true,
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
        slidesPerView: this.thumbnailsPerPage,
        slidesPerGroup: this.thumbnailsPerPage,
        spaceBetween: 10,
        centerInsufficientSlides: true,
        slideToClickedSlide: true,
        navigation: {
          nextEl: this.next,
          prevEl: this.previous,
        },
      });
    }
  }

  disconnectedCallback() {
    this.swiper.destroy(true, true);
    if (this.thumbsSwiper) {
      this.thumbsSwiper.destroy(true, true);
    }
  }

  render() {
    return (
      <div class="image-slider" part="base">
        <div class="swiper" ref={el => (this.swiperContainerRef = el)}>
          <div class="swiper-wrapper">
            {(this.imagesData || []).map(({ src, alt }, index) => (
              <div key={index} class="swiper-slide image-slider__slider">
                <div class="swiper-slide-img">
                  <img src={src} alt={alt} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {this.thumbnails && (
          <div class={{ 'image-slider__thumbs': true, 'image-slider__thumbs--has-navigation': this.imagesData.length > 5 }}>
            <div class="image-slider__navigation image-slider--is-prev" ref={el => (this.previous = el)}>
              <sc-icon name="chevron-left" />
            </div>

            <div class="swiper" ref={el => (this.swiperThumbsRef = el)}>
              <div class="swiper-wrapper">
                {!!this.imagesData.length &&
                  this.imagesData.map(({ src, alt }, index) => (
                    <div
                      class={{ 'swiper-slide': true, 'image-slider__thumb': true, 'image-slider__thumb--is-active': this.currentSliderIndex === index }}
                      onClick={() => this.swiper?.slideTo?.(index)}
                    >
                      <img src={src} alt={alt} />
                    </div>
                  ))}
              </div>
            </div>

            <div class="image-slider__navigation image-slider--is-next" ref={el => (this.next = el)}>
              <sc-icon name="chevron-right" />
            </div>
          </div>
        )}
      </div>
    );
  }
}
