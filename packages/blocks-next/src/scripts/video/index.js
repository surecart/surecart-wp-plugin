/**
 * WordPress dependencies.
 */
import { store, getContext, getElement } from '@wordpress/interactivity';

// Return true when we should NOT pause this video (e.g. autoplay or loop enabled).
const shouldSkipPause = (video) => {
	if (!video) {
		return false;
	}

	// HTMLMediaElement has boolean properties for these boolean attributes.
	// We also defensively check attributes in case of non-standard objects.
	return !!(
		video?.autoplay ||
		video?.loop ||
		(typeof video.hasAttribute === 'function' &&
			(video.hasAttribute('autoplay') || video.hasAttribute('loop')))
	);
};

store('surecart/video', {
	callbacks: {
		// Handle the play event.
		handlePlay() {
			const { ref } = getElement();
			const context = getContext();

			// video is loaded once it's played.
			context.loaded = true;

			// Try to find the current video element inside this container.
			const currentVideo = ref ? ref.querySelector('video') : null;

			// pause other videos on the page unless they are autoplay/loop.
			Array.from(document.querySelectorAll('video'))
				.filter((v) => v !== currentVideo) // get other videos.
				.forEach((video) => {
					if (!shouldSkipPause(video)) {
						video.pause();
					}
				});
		},

		handleFullscreenChange() {
			const { ref } = getElement();
			const video = ref?.querySelector('video');

			if (!video || !!video?.paused) {
				return;
			}

			// Pause the video if its in a slider if not in fullscreen.
			if (document?.fullscreenElement !== video) {
				const swiper = video.closest('.swiper');
				if (swiper) {
					const { state: sliderState } = store(
						'surecart/image-slider'
					);

					if (
						sliderState?.active &&
						!!sliderState?.swiper &&
						!shouldSkipPause(video)
					) {
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

				if (!shouldSkipPause(video)) {
					video.pause();
				}
			}
		},
	},
	actions: {
		// Play the video.
		play() {
			const { ref } = getElement();

			// Get the stored video element for this container.
			const video = ref.querySelector('video');

			// no video element found.
			if (!video) {
				return;
			}

			video.play();
		},
		// Pause all videos.
		pauseVideos() {
			Array.from(document.querySelectorAll('video')).forEach((video) => {
				if (!shouldSkipPause(video)) {
					video.pause();
				}
			});
		},
	},
});
