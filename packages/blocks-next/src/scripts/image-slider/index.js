/**
 * Wordpress dependencies
 */
import { store, getElement, getContext } from '@wordpress/interactivity';
const { __ } = wp.i18n;

/**
 * External dependencies
 */
import Swiper from 'swiper';
import { Thumbs, Navigation, A11y, Pagination } from 'swiper/modules';

const mapLightboxIndexToSliderIndex = (lightboxImageIndex) => {
	const { state: lightboxState } = store('surecart/lightbox');
	const { ref } = getElement();

	if (
		lightboxImageIndex === -1 ||
		!lightboxState.images?.[lightboxImageIndex]
	) {
		return -1;
	}

	const targetImageId = lightboxState.images[lightboxImageIndex];
	const slides = Array.from(ref.querySelectorAll('.swiper-slide'));

	return slides.findIndex((slide) => {
		const slideId = slide.getAttribute('data-wp-key');
		const hasVideo = slide.querySelector('video');

		return (
			slideId &&
			!hasVideo &&
			lightboxState.metadata?.[slideId]?.imageRef &&
			slideId.toString() === targetImageId.toString()
		);
	});
};

// controls the slider
const { state, actions } = store('surecart/image-slider', {
	state: {
		thumbsSwiper: null,
		swiper: null,
		active: false,
	},
	actions: {
		updateSlider: () => {
			const { state: productState } = store('surecart/product-page');
			const { state: lightboxState } = store('surecart/lightbox');

			if (
				lightboxState?.currentImageIndex !== undefined &&
				lightboxState.currentImageIndex !== -1
			) {
				const sliderIndex = mapLightboxIndexToSliderIndex(
					lightboxState.currentImageIndex
				);

				if (sliderIndex !== -1) {
					state.swiper?.slideTo(sliderIndex, 0);
				}
			}

			// the selected variant has not changed.
			if (!productState.selectedVariant) {
				return;
			}

			// it's important that the thumbs swiper initializes first before the main swiper.
			if (state.thumbsSwiper) {
				state.thumbsSwiper.update();
			}

			if (state.swiper) {
				state.swiper.update();
			}
		},

		destroy: () => {
			state.active = false;
			if (state.swiper) {
				state.swiper.destroy(true, true);
			}
			if (state.thumbsSwiper) {
				state.thumbsSwiper.destroy(true, true);
			}
		},

		create: () => {
			if (state.active) {
				return;
			}
			state.active = true;
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
			const thumbs = thumbsContainer
				? thumbsContainer.querySelector(
						'.sc-image-slider__thumbs .swiper'
				  )
				: null;

			// if we have a thumbs container.
			state.thumbsSwiper =
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

			state.swiper = new Swiper(
				ref.querySelector(
					'.swiper:not(.sc-image-slider__thumbs .swiper)'
				),
				{
					on: {
						slideChange: () => {
							const { actions: videoActions } =
								store('surecart/video');
							if (
								typeof videoActions?.pauseVideos === 'function'
							) {
								videoActions.pauseVideos();
							}
						},
						slideChangeTransitionEnd: () => {
							// Resume autoplay videos in the active slide after transition
							const { actions: videoActions } =
								store('surecart/video');
							if (
								typeof videoActions?.resumeVideos === 'function'
							) {
								videoActions.resumeVideos(
									state.swiper.slides[
										state.swiper.activeIndex
									].querySelector('video')
								);
							}
						},
					},
					modules: [Thumbs, A11y, Navigation, Pagination],
					direction: 'horizontal',
					loop: false,
					centeredSlides: true,
					a11y,
					lazyPreloadPrevNext: 2,
					navigation: {
						nextEl: ref.querySelector('.swiper-button-next'),
						prevEl: ref.querySelector('.swiper-button-prev'),
					},
					...(!thumbs && {
						pagination: {
							el: ref.querySelector('.swiper-pagination'),
							dynamicBullets: true,
							dynamicMainBullets: 6,
							clickable: true,
						},
					}),
					...(!!thumbs &&
						state.thumbsSwiper && {
							thumbs: {
								swiper: state.thumbsSwiper,
							},
						}),
					...(sliderOptions || {}),
				}
			);
		},

		init: () => {
			if (state.active) {
				actions.destroy(); // destroy the existing slider if it exists.
			}
			const context = getContext();
			if (context.activeBreakpoint) {
				if (window.innerWidth >= context.activeBreakpoint) {
					actions.destroy();
					return;
				}
			}
			actions.create();
		},
	},
});
