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
				const video = ref?.querySelector('video[data-src]');
				if (video && !video?.src) {
					// If no src set means lazy not initialized yet.
					callbacks.initLazyLoading(video, context);
				}
			}
		},

		// Initialize lazy loading with Intersection Observer.
		initLazyLoading(video, context) {
			if (!('IntersectionObserver' in window)) {
				// Fallback for older browsers - load immediately.
				callbacks.loadVideo(video, context);
				return () => {}; // Return empty cleanup function for consistency.
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

			// Disconnect observer on cleanup.
			return () => {
				observer.disconnect();
			};
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

			// Load the video metadata.
			video.load();
		},

		// Handle video load start event.
		handleLoadStart() {
			const context = getContext();
			context.loading = true;
		},

		// Handle video loaded data event.
		handleLoadedData() {
			const context = getContext();
			context.loading = false;
			context.loaded = true;
		},

		// Handle video load error event.
		handleError() {
			const context = getContext();
			const { ref } = getElement();

			context.loading = false;
			console.error(
				'Video failed to load:',
				(ref?.querySelector('video') ?? ref)?.src
			);
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

			// Load video if it's still data-src (lazy) somehow.
			if (!!currentVideo?.dataset?.src) {
				callbacks.loadVideo(currentVideo, context);
			}

			// Ensure the current video is playing.
			currentVideo?.play();

			// pause other videos on the page unless they are autoplay/loop.
			Array.from(document.querySelectorAll('video'))
				.filter((v) => v !== currentVideo) // get other videos.
				.forEach((video) => (video.muted = true));
		},

		handleFullscreenChange() {
			const { ref } = getElement();
			const video = ref?.querySelector('video');

			// no video element found or video is not playing.
			if (!video || !!video?.paused) {
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
						video.pause();
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

			// Load video if it's still data-src (lazy).
			if (video.dataset.src) {
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

		// pause all videos.
		pauseVideos() {
			Array.from(document.querySelectorAll('video')).forEach((video) =>
				video.pause()
			);
		},

		// Resume autoplay videos.
		resumeVideos(video) {
			if (!!video?.autoplay) {
				video.play().catch((error) => {
					console.warn('Video autoplay resume failed:', error);
				});
			}
		},
	},
});
