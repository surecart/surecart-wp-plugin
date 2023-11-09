import { Component, Prop, State, Watch, h } from '@stencil/core';
import { __, sprintf } from '@wordpress/i18n';
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
  @Prop() images: string | { src: string; alt: string; srcset; width: number; height: number; sizes: string }[];
  @Prop() thumbnails: string | { src: string; alt: string; srcset; width: number; height: number; sizes: string }[] = [];
  @Prop() hasThumbnails: boolean;
  @Prop() thumbnailsPerPage: number = 5;
  @Prop() autoHeight: boolean;

  /** Current Slide Index */
  @State() currentSliderIndex: number = 0;
  @State() imagesData: { src: string; alt: string; srcset; width: number; height: number; sizes: string }[] = [];
  @State() thumbnailsData: { src: string; alt: string; srcset; width: number; height: number; sizes: string }[] = [];

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

  @Watch('thumbnails')
  parseThumnails(newValue: string | { src: string; alt: string }[]) {
    if (newValue) this.thumbnailsData = typeof newValue == 'string' ? JSON.parse(newValue) : newValue;
  }

  componentWillLoad() {
    this.parseImages(this.images);
    this.parseThumnails(this.thumbnails);
  }

  componentDidUpdate() {
    this.swiper.update();
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
    const thumbnails = this.thumbnailsData?.length ? this.thumbnailsData : this.imagesData;
    return (
      <div class={{ 'image-slider': true, 'image-slider--is-fixed-height': !this.autoHeight }} part="base">
        <div class="swiper" ref={el => (this.swiperContainerRef = el)}>
          <div class="swiper-wrapper">
            {(this.imagesData || []).map(({ src, alt, srcset, width, height, sizes }, index) => (
              <div key={index} class="swiper-slide image-slider__slider">
                <div class="swiper-slide-img">
                  <img src={src} alt={alt} srcset={srcset} width={width} height={height} sizes={sizes} loading={index > 0 ? 'lazy' : 'eager'} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {this.hasThumbnails && (
          <div class={{ 'image-slider__thumbs': true, 'image-slider__thumbs--has-navigation': this.images.length > 5 }}>
            <div class="image-slider__navigation image-slider--is-prev" ref={el => (this.previous = el)}>
              <button>
                <span class="sc-sr-only"></span>
                <sc-icon aria-hidden="true" name="chevron-left" />
              </button>
            </div>

            <div class="swiper" ref={el => (this.swiperThumbsRef = el)}>
              <div class="swiper-wrapper">
                {(thumbnails || []).map(({ src, alt, srcset, width, height, sizes }, index) => (
                  <button
                    class={{ 'swiper-slide': true, 'image-slider__thumb': true, 'image-slider__thumb--is-active': this.currentSliderIndex === index }}
                    onClick={() => this.swiper?.slideTo?.(index)}
                  >
                    <img
                      src={src}
                      alt={sprintf(__('Product image number %d, %s', 'sc-image-slider'), index + 1, alt)}
                      srcset={srcset}
                      width={width}
                      height={height}
                      sizes={sizes}
                      loading={index > this.thumbnailsPerPage - 1 ? 'lazy' : 'eager'}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div class="image-slider__navigation image-slider--is-next" ref={el => (this.next = el)}>
              <button>
                <span class="sc-sr-only"></span>
                <sc-icon aria-hidden="true" name="chevron-right" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}
