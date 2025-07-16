/**
 * WordPress dependencies.
 */
import { store, getContext, getElement } from '@wordpress/interactivity';

store('surecart/video', {
	actions: {
		playVideo() {
			const context = getContext();
			const { ref } = getElement();

			// If this video is already playing, do nothing.
			if (context.isVideoPlaying) {
				return;
			}

			// Get the stored video element for this container.
			const video = ref.querySelector('video');

			if (video) {
				video
					.play()
					.catch((error) => {
						console.error('Error playing video:', error);
					})
					.finally(() => {
						context.isVideoPlaying = true;
					});
			}
		},
	},
});
