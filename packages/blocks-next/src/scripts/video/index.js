/**
 * WordPress dependencies.
 */
import { store, getContext, getElement } from '@wordpress/interactivity';

const { state, callbacks, actions } = store('surecart/video', {
	state: {
		get showControls() {
			const context = getContext();
			return !!context?.controls && !!context?.loaded;
		},
	},
	callbacks: {
		// Initialize lazy loading on element creation.
		init() {
			const { ref } = getElement();
			const context = getContext();

			// Set up lazy loading for videos those are autoplay.
			if (!!context?.autoplay) {
				const video = ref?.querySelector('video[data-lazy]');
				if (video && !video.dataset.lazyInitialized) {
					callbacks.initLazyLoading(video, context);
					video.dataset.lazyInitialized = 'true';
				}
			}
		},

		// Initialize lazy loading with Intersection Observer.
		initLazyLoading(video, context) {
			if (!('IntersectionObserver' in window)) {
				// Fallback for older browsers - load immediately.
				callbacks.loadVideo(video, context);
				return;
			}

			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							callbacks.loadVideo(entry.target, context);
							observer.unobserve(entry.target);
						}
					});
				},
				{
					threshold: 0.5, // Load when video is 50% visible.
					rootMargin: '200px', // Load 200px before entering viewport.
				}
			);

			observer.observe(video);
		},

		// Load video src and metadata.
		loadVideo(video, context) {
			if (!context) {
				return;
			}

			context.loading = true;

			// Set the video src from data-src attribute.
			if (video.dataset.src) {
				video.src = video.dataset.src;
				video.removeAttribute('data-src');
			}

			// Set up event listeners for load events.
			const handleLoadStart = () => {
				context.loading = true;
			};

			const handleLoadedData = () => {
				context.loading = false;
				context.loaded = true;
				video.removeEventListener('loadstart', handleLoadStart);
				video.removeEventListener('loadeddata', handleLoadedData);
				video.removeEventListener('error', handleError);
			};

			const handleError = () => {
				context.loading = false;
				console.warn('Video failed to load:', video.src);
				video.removeEventListener('loadstart', handleLoadStart);
				video.removeEventListener('loadeddata', handleLoadedData);
				video.removeEventListener('error', handleError);
			};

			video.addEventListener('loadstart', handleLoadStart);
			video.addEventListener('loadeddata', handleLoadedData);
			video.addEventListener('error', handleError);

			// Load the video metadata.
			video.load();
			video.removeAttribute('data-lazy');
		},

		// Handle mouse enter for preloading metadata.
		handleMouseEnter() {
			const { ref } = getElement();
			const video = ref?.querySelector('video');

			if (video && video.preload === 'none') {
				video.preload = 'metadata';
			}
		},

		// Handle the play event.
		handlePlay() {
			const { ref } = getElement();
			const context = getContext();

			// video is loaded once it's played.
			context.loaded = true;

			// Try to find the current video element inside this container.
			const currentVideo = ref?.querySelector('video') ?? ref ?? null;

			// Load video if it's still lazy somehow.
			if (!!currentVideo?.dataset?.lazy) {
				callbacks.loadVideo(currentVideo, context);
			}

			// pause other videos on the page unless they are autoplay/loop.
			Array.from(document.querySelectorAll('video'))
				.filter((v) => v !== currentVideo) // get other videos.
				.forEach((video) => (video.muted = true));
		},

		handleFullscreenChange() {
			const { ref } = getElement();
			const video = ref?.querySelector('video');

			if (!video || !!video?.muted || !!video?.paused) {
				return;
			}

			// Mute the video if its in a slider if not in fullscreen.
			if (document?.fullscreenElement !== video) {
				const swiper = video.closest('.swiper');
				if (swiper) {
					const { state: sliderState } = store(
						'surecart/image-slider'
					);

					if (sliderState?.active && !!sliderState?.swiper) {
						video.muted = true;
					}
				}
			}
		},

		checkVariantChange() {
			const {
				state: { shouldDisplayImage },
			} = store('surecart/product-page');

			if (!shouldDisplayImage) {
				const { ref } = getElement();

				// Get the stored video element for this container.
				const video = ref.querySelector('video');

				// no video element found.
				if (!video) {
					return;
				}

				video.muted = true;
			}
		},
	},
	actions: {
		// Play the video.
		play() {
			const { ref } = getElement();
			const context = getContext();

			// Get the stored video element for this container.
			const video = ref.querySelector('video');

			// no video element found.
			if (!video) {
				return;
			}

			// Load video if it's still lazy.
			if (video.dataset.lazy) {
				callbacks.loadVideo(video, context);

				// Wait for video to load before playing.
				const playWhenReady = () => {
					if (video.readyState >= 3) {
						// HAVE_FUTURE_DATA
						video.play().catch((error) => {
							console.warn('Video autoplay failed:', error);
						});
						video.removeEventListener('canplay', playWhenReady);
					}
				};

				if (video.readyState >= 3) {
					// HAVE_FUTURE_DATA
					video.play().catch((error) => {
						console.warn('Video autoplay failed:', error);
					});
				} else {
					video.addEventListener('canplay', playWhenReady);
				}
			} else {
				video.play().catch((error) => {
					console.warn('Video autoplay failed:', error);
				});
			}
		},
		// mute all videos.
		muteVideos() {
			Array.from(document.querySelectorAll('video')).forEach(
				(video) => (video.muted = true)
			);
		},
	},
});
