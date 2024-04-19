/**
 * Wordpress dependencies
 */
import { store, getElement, getContext } from '@wordpress/interactivity';
const { __, sprintf } = wp.i18n;

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

			const thumbsSwiper =
				context.hasThumbnails &&
				new Swiper(
					ref.querySelector('.sc-image-slider__thumbs-swiper'),
					{
						modules: [Navigation],
						direction: 'horizontal',
						wrapperClass: 'sc-image-slider__swiper-wrapper',
						navigation: {
							nextEl: ref.querySelector(
								'.sc-image-slider--is-next'
							),
							prevEl: ref.querySelector(
								'.sc-image-slider--is-prev'
							),
						},
						loop: false,
						centerInsufficientSlides: true,
						slideToClickedSlide: true,
						watchSlidesProgress: true,
						slidesPerView: Math.min(3, context.thumbnailsPerPage),
						slidesPerGroup: Math.min(3, context.thumbnailsPerPage),
						spaceBetween: 10,
						breakpointsBase: 'container',
						breakpoints: {
							320: {
								slidesPerView: context.thumbnailsPerPage,
								slidesPerGroup: context.thumbnailsPerPage,
							},
						},
					}
				);

			new Swiper(ref.querySelector('.sc-image-slider__swiper'), {
				modules: [Thumbs, A11y, Navigation],
				wrapperClass: 'sc-image-slider__swiper-wrapper',
				direction: 'horizontal',
				loop: false,
				autoHeight: context.autoHeight,
				centeredSlides: true,
				a11y: {
					enabled: true,
					prevSlideMessage: __('Go to previous slide.', 'surecart'),
					firstSlideMessage: __(
						'This is the first slide.',
						'surecart'
					),
					lastSlideMessage: __('This is the last slide.', 'surecart'),
					nextSlideMessage: __('Go to next slide.', 'surecart'),
					slideLabelMessage: __(
						'Slide {{index}} of {{slidesLength}}.',
						'surecart'
					),
				},
				navigation: {
					nextEl: ref.querySelector(
						'.sc-image-slider__swiper .swiper-button-next'
					),
					prevEl: ref.querySelector(
						'.sc-image-slider__swiper .swiper-button-prev'
					),
				},
				...(context.hasThumbnails &&
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
			});
		},
	},
});
