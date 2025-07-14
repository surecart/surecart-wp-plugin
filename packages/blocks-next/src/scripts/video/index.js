/**
 * WordPress dependencies.
 */
import { store, getContext, getElement } from '@wordpress/interactivity';

store('surecart/video', {
	actions: {
		playVideo() {
			const context = getContext();
			const { ref } = getElement();

			// If video is already playing, do nothing.
			if (context.isVideoPressed) {
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
						context.isVideoPressed = true;
					});
			}
		},
	},
});
