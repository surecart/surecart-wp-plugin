/**
 * Wordpress dependencies
 */
import { store, getElement, getContext } from '@wordpress/interactivity';

/**
 * External dependencies
 */
import Swiper from 'swiper';
import { Thumbs } from 'swiper/modules';

// controls the slider
store('surecart/image-slider', {
	actions: {
		init: () => {
			const { ref } = getElement();
			const context = getContext();

			const thumbsSwiper = new Swiper(
				ref.querySelector('.image-slider__thumbs-swiper'),
				{
					direction: 'horizontal',
					loop: false,
					slidesPerView: context.thumbnailsPerPage,
					slidesPerGroup: context.thumbnailsPerPage,
					spaceBetween: 10,
					centerInsufficientSlides: true,
					slideToClickedSlide: true,
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

			// imageSwiper.on(
			// 	'slideChange',
			// 	() =>
			// 		thumbsSwiper.activeIndex !== imageSwiper.activeIndex &&
			// 		thumbsSwiper.slideTo(imageSwiper.activeIndex)
			// );

			// thumbsSwiper.on(
			// 	'slideChange',
			// 	() =>
			// 		thumbsSwiper.activeIndex !== imageSwiper.activeIndex &&
			// 		imageSwiper.slideTo(thumbsSwiper.activeIndex)
			// );

			context.swiper = imageSwiper;
		},
	},
});
