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
const { state, actions } = store('surecart/image-slider', {
	state: {
		thumbsSwiper: null,
		swiper: null,
		active: false,
		videoObservers: [],
	},
	actions: {
		updateSlider: () => {
			const { state: productState } = store('surecart/product-page');
			const { state: lightboxState } = store('surecart/lightbox');

			if (
				lightboxState?.currentImageIndex !== undefined &&
				lightboxState.currentImageIndex !== -1
			) {
				state.swiper?.slideTo(lightboxState.currentImageIndex, 0);
			}

			// the selected variant has not changed.
			if (!productState.selectedVariant) {
				// Manage video controls even if variant hasn't changed
				actions.manageVideoControls();
				return;
			}

			// it's important that the thumbs swiper initializes first before the main swiper.
			if (state.thumbsSwiper) {
				state.thumbsSwiper.update();
			}

			if (state.swiper) {
				state.swiper.update();
			}

			// Manage video controls after slider update
			actions.manageVideoControls();
		},

		destroy: () => {
			state.active = false;
			actions.cleanupVideoObservers();
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
					modules: [Thumbs, A11y, Navigation],
					direction: 'horizontal',
					loop: false,
					centeredSlides: true,
					a11y,
					lazyPreloadPrevNext: 2,
					navigation: {
						nextEl: ref.querySelector('.swiper-button-next'),
						prevEl: ref.querySelector('.swiper-button-prev'),
					},
					...(!!thumbs &&
						state.thumbsSwiper && {
							thumbs: {
								swiper: state.thumbsSwiper,
							},
						}),
					...(sliderOptions || {}),
				}
			);

			// Initialize video controls management with longer delay to ensure DOM is ready
			setTimeout(() => {
				actions.manageVideoControls();
			}, 500);
		},

		manageVideoControls: () => {
			const { ref } = getElement();
			const videoContainers = ref.querySelectorAll('.sc-video-container');

			videoContainers.forEach((container) => {
				const overlayButton = container.querySelector(
					'.mejs-overlay-button[aria-pressed]'
				);
				const controlsElement =
					container.querySelector('.mejs-controls');
				const mejsOverlay =
					container.querySelector('.mejs-overlay-play');

				if (overlayButton && controlsElement) {
					// Create custom play button if it doesn't exist.
					let customPlayButton = container.querySelector(
						'.sc-video-play-button'
					);
					if (!customPlayButton) {
						customPlayButton = document.createElement('div');
						customPlayButton.className = 'sc-video-play-button';
						customPlayButton.setAttribute('role', 'button');
						customPlayButton.setAttribute('tabindex', '0');
						customPlayButton.setAttribute(
							'aria-label',
							'Play video'
						);

						// Add click handler to trigger the original overlay button
						customPlayButton.addEventListener('click', () => {
							overlayButton.click();
						});

						// Add keyboard support
						customPlayButton.addEventListener('keydown', (e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								overlayButton.click();
							}
						});

						// Insert the custom button into the container
						container.appendChild(customPlayButton);
					}

					// Function to update controls and button visibility
					const updateControlsVisibility = () => {
						const isPressed =
							overlayButton.getAttribute('aria-pressed') ===
							'true';

						if (!isPressed) {
							// Video is paused/stopped.
							controlsElement.style.opacity = '0';
							controlsElement.classList.add('mejs-offscreen');

							// Hide original overlay button.
							if (mejsOverlay) {
								mejsOverlay.style.display = 'none';
							}

							// Show custom play button.
							customPlayButton.style.display = 'flex';
						} else {
							// Video is playing.
							controlsElement.style.opacity = '';
							controlsElement.classList.remove('mejs-offscreen');

							// Show original overlay (if needed).
							if (mejsOverlay) {
								mejsOverlay.style.display = '';
							}

							// Hide custom play button.
							customPlayButton.style.display = 'none';
						}
					};

					// Initial check
					updateControlsVisibility();

					// Create observer for aria-pressed changes
					const observer = new MutationObserver((mutations) => {
						mutations.forEach((mutation) => {
							if (
								mutation.type === 'attributes' &&
								mutation.attributeName === 'aria-pressed'
							) {
								updateControlsVisibility();
							}
						});
					});

					// Start observing
					observer.observe(overlayButton, {
						attributes: true,
						attributeFilter: ['aria-pressed'],
					});

					// Store observer for cleanup
					state.videoObservers.push(observer);
				}
			});
		},

		cleanupVideoObservers: () => {
			state.videoObservers.forEach((observer) => observer.disconnect());
			state.videoObservers = [];
		},

		init: () => {
			const context = getContext();
			if (context.activeBreakpoint) {
				if (window.innerWidth >= context.activeBreakpoint) {
					actions.destroy();
					return;
				}
			}
			actions.create();

			// Manage video controls on init.
			setTimeout(() => {
				actions.manageVideoControls();
			}, 1000);
		},
	},
});
