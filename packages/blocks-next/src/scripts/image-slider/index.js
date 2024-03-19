/**
 * Wordpress dependencies
 */
import { store } from '@wordpress/interactivity';

/**
 * External dependencies
 */
import Swiper from 'swiper';

// controls the slider
const { state } = store('surecart/image-slider', {
	state: {},
	actions: {
		init: () => {
			// get a reference to the element that called this action
			const swiperContainer = document.querySelector('.swiper');

			if (swiperContainer) {
				const swiper = new Swiper(swiperContainer, {
					loop: true,
					autoplay: {
						delay: 5000,
					},
					navigation: {
						nextEl: '.swiper-button-next',
						prevEl: '.swiper-button-prev',
					},
				});
			}
		},
	},
});
