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
	actions: {
		init: () => {
			const { ref } = getElement();
			const context = getContext();

			const thumbsSwiper = new Swiper(
				ref.querySelector('.image-slider__thumbs-swiper'),
				{
					modules: [Navigation],
					direction: 'horizontal',
					loop: false,
					slidesPerView: context.thumbnailsPerPage,
					slidesPerGroup: context.thumbnailsPerPage,
					spaceBetween: 10,
					centerInsufficientSlides: true,
					slideToClickedSlide: true,
					navigation: {
						nextEl: ref.querySelector(
							'.image-slider__thumbs .image-slider--is-next'
						),
						prevEl: ref.querySelector(
							'.image-slider__thumbs .image-slider--is-prev'
						),
					},
				}
			);

			const imageSwiper = new Swiper(
				ref.querySelector('.image-slider__swiper'),
				{
					modules: [Thumbs],
					direction: 'horizontal',
					loop: false,
					autoHeight: true,
					centeredSlides: true,
					thumbs: {
						swiper: thumbsSwiper,
					},
				}
			);

			context.swiper = imageSwiper;
		},
	},
});
