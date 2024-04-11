/**
 * Wordpress dependencies
 */
import { store, getElement, getContext } from '@wordpress/interactivity';

/**
 * External dependencies
 */
import Swiper from 'swiper';
import { Thumbs, Navigation } from 'swiper/modules';

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
								'.sc-image-slider__thumbs .sc-image-slider--is-next'
							),
							prevEl: ref.querySelector(
								'.sc-image-slider__thumbs .sc-image-slider--is-prev'
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
				modules: [Thumbs],
				wrapperClass: 'sc-image-slider__swiper-wrapper',
				direction: 'horizontal',
				loop: false,
				autoHeight: context.autoHeight,
				centeredSlides: true,
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
