/**
 * WordPress dependencies.
 */
import { store, getContext, getElement } from '@wordpress/interactivity';

store('surecart/video', {
	callbacks: {
		// Handle the play event.
		handlePlay() {
			const { ref } = getElement();
			const context = getContext();

			// video is loaded once it's played.
			context.loaded = true;

			// pause other videos on the page.
			Array.from(document.querySelectorAll('video'))
				.filter((v) => v !== ref) // get other videos.
				.forEach((video) => video.pause()); // pause them.
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

					if (sliderState?.active && !!sliderState?.swiper) {
						video.pause();
					}
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
				video.pause();
			});
		},
	},
});
