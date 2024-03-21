/**
 * Wordpress dependencies
 */
import { store, getElement, getContext } from '@wordpress/interactivity';

/**
 * External dependencies
 */
import Swiper, { Navigation } from 'swiper';

// controls the slider
store('surecart/image-slider', {
	actions: {
		initImageSwiper: () => {
			const { ref } = getElement();
			const context = getContext();

			context.swiper = new Swiper(ref, {
				direction: 'horizontal',
				loop: false,
				autoHeight: true,
				centeredSlides: true,
				on: {
					slideChange: (swiper) => {
						context.currentSliderIndex = swiper.activeIndex;
					},
				},
			});
		},
		initThumbsSwiper: () => {
			const { ref } = getElement();
			const context = getContext();

			context.thumbsSwiper = new Swiper(ref, {
				modules: [Navigation],
				direction: 'horizontal',
				loop: false,
				slidesPerView: 5, // thumbnailsPerPage
				slidesPerGroup: 5, // thumbnailsPerPage
				spaceBetween: 10,
				centerInsufficientSlides: true,
				slideToClickedSlide: true,
				navigation: {
					nextEl: ref.querySelector('image-slider--is-prev'),
					prevEl: ref.querySelector('image-slider--is-next'),
				},
			});
		},
		onThumbClick: () => {
			// check how the context is passed from the variant choices
			const { ref } = getElement();
			const index = Number.parseInt(ref.getAttribute('thumb-index'));

			// set the current slider index
			const context = getContext();
			context.currentSliderIndex = index;
		},
		onSliderChange: () => {
			const context = getContext();
			context.swiper.slideTo(context.currentSliderIndex || 0);

			const slideInView =
				context.currentSliderIndex >=
					context.thumbsSwiper.activeIndex &&
				context.currentSliderIndex <
					context.thumbsSwiper.activeIndex +
						context.thumbnailsPerPage;
			if (!slideInView) {
				context.thumbsSwiper.slideTo(context.currentSliderIndex);
			}
		},
	},
});
