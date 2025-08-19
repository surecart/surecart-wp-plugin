/**
 * WordPress dependencies.
 */
import { store, getContext, getElement } from '@wordpress/interactivity';

const { actions } = store('surecart/video', {
	actions: {
		async play() {
			const context = getContext();
			const { ref } = getElement();

			// If this video is already playing, do nothing.
			if (context.isVideoPlaying) {
				return;
			}

			// pause all other videos.
			actions.pauseVideos();

			// always show the video.
			context.isVideoPlaying = true;

			// Get the stored video element for this container.
			const video = ref.querySelector('video');

			// it's not a video element.
			if (!video) {
				return;
			}

			try {
				await video.play();
			} catch (error) {
				console.error('Error playing video:', error);
			}
		},
		pauseVideos() {
			const videos = document.querySelectorAll('video');
			(videos || []).forEach((video) => {
				video.pause();
			});
		},
	},
});
