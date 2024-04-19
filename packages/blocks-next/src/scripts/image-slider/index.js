/**
 * Wordpress dependencies
 */
import { store, getElement, getContext } from '@wordpress/interactivity';
const { __ } = wp.i18n;

/**
 * External dependencies
 */
import Swiper from 'swiper';
import { Thumbs, Navigation, A11y } from 'swiper/modules';

// controls the slider
store('surecart/image-slider', {
	context: {
		/**
		 * Derived State
		 */
		/**
		 * Is active slide
		 */
		get isActiveSlide() {
			const { currentSliderIndex, slideIndex } = getContext();
			return currentSliderIndex === slideIndex;
		},
	},
	actions: {
		init: () => {
			const { ref } = getElement();
			const context = getContext();
			const { sliderOptions, thumbSliderOptions } = context;

			const a11y = {
				enabled: true,
				prevSlideMessage: __('Go to previous slide.', 'surecart'),
				firstSlideMessage: __('This is the first slide.', 'surecart'),
				lastSlideMessage: __('This is the last slide.', 'surecart'),
				nextSlideMessage: __('Go to next slide.', 'surecart'),
				slideLabelMessage: __(
					'Slide {{index}} of {{slidesLength}}.',
					'surecart'
				),
			};

			// get the thumbs container.
			const thumbsContainer = ref.querySelector(
				'.sc-image-slider__thumbs'
			);
			const thumbs = thumbsContainer.querySelector(
				'.sc-image-slider__thumbs .swiper'
			);

			// if we have a thumbs container.
			const thumbsSwiper =
				!!thumbs &&
				new Swiper(thumbs, {
					modules: [Navigation],
					direction: 'horizontal',
					navigation: {
						nextEl:
							thumbsContainer.querySelector(
								'.sc-image-slider-button__next'
							) ||
							thumbsContainer.querySelector(
								'.swiper-button-next'
							),
						prevEl:
							thumbsContainer.querySelector(
								'.sc-image-slider-button__prev'
							) ||
							thumbsContainer.querySelector(
								'.swiper-button-prev'
							),
					},
					a11y,
					loop: false,
					centerInsufficientSlides: true,
					slideToClickedSlide: true,
					watchSlidesProgress: true,
					slidesPerView: 3,
					slidesPerGroup: 3,
					spaceBetween: 10,
					breakpointsBase: 'container',
					breakpoints: {
						320: {
							slidesPerView: 5,
							slidesPerGroup: 5,
						},
					},
					...(thumbSliderOptions || {}),
				});

			new Swiper(
				ref.querySelector(
					'.swiper:not(.sc-image-slider__thumbs .swiper)'
				),
				{
					modules: [Thumbs, A11y, Navigation],
					direction: 'horizontal',
					loop: false,
					centeredSlides: true,
					a11y,
					navigation: {
						nextEl: ref.querySelector('.swiper-button-next'),
						prevEl: ref.querySelector('.swiper-button-prev'),
					},
					...(!!thumbs &&
						thumbsSwiper && {
							thumbs: {
								swiper: thumbsSwiper,
							},
						}),
					on: {
						slideChange: (swiper) => {
							context.currentSliderIndex = swiper.activeIndex;
						},
					},
					...(sliderOptions || {}),
				}
			);
		},
	},
});
