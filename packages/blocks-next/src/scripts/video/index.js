/**
 * WordPress dependencies.
 */
import { store, getContext, getElement } from '@wordpress/interactivity';

store('surecart/video', {
	state: {
		get showControls() {
			const context = getContext();
			return !!context?.controls && !!context?.loaded;
		},
	},
	callbacks: {
		// Handle the play event.
		handlePlay() {
			const { ref } = getElement();
			const context = getContext();

			// video is loaded once it's played.
			context.loaded = true;

			// Try to find the current video element inside this container.
			const currentVideo = ref ? ref.querySelector('video') : null;

			// mute other videos on the page unless they are autoplay/loop.
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

			// Get the stored video element for this container.
			const video = ref.querySelector('video');

			// no video element found.
			if (!video) {
				return;
			}

			video.play();
		},
		// mute all videos.
		muteVideos() {
			Array.from(document.querySelectorAll('video')).forEach(
				(video) => (video.muted = true)
			);
		},
	},
});
