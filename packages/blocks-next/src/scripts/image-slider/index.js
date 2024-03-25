/**
 * Wordpress dependencies
 */
import { store, getElement, getContext } from '@wordpress/interactivity';

/**
 * External dependencies
 */
import Swiper, { Thumbs, Navigation } from 'swiper';

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
						loop: false,
						slidesPerView: context.thumbnailsPerPage,
						slidesPerGroup: context.thumbnailsPerPage,
						spaceBetween: 10,
						centerInsufficientSlides: true,
						slideToClickedSlide: true,
						wrapperClass: 'sc-image-slider__swiper-wrapper',
						navigation: {
							nextEl: ref.querySelector(
								'.sc-image-slider__thumbs .sc-image-slider--is-next'
							),
							prevEl: ref.querySelector(
								'.sc-image-slider__thumbs .sc-image-slider--is-prev'
							),
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
