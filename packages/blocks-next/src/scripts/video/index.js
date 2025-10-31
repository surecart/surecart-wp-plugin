/**
 * WordPress dependencies.
 */
import {
	store,
	getContext,
	getElement,
	useState,
	useEffect,
} from '@wordpress/interactivity';

// useInView hook to check if the video is in view.
const useInView = () => {
	const [inView, setInView] = useState(false);
	useEffect(() => {
		const { ref } = getElement();
		const observer = new IntersectionObserver(([entry]) => {
			setInView(entry.isIntersecting);
		});
		observer.observe(ref);
		return () => ref && observer.unobserve(ref);
	}, []);
	return inView;
};

store('surecart/video', {
	state: {
		get showControls() {
			const context = getContext();
			return !!context?.controls && !!context?.loaded;
		},
	},
	callbacks: {
		loadInView() {
			const inView = useInView();

			useEffect(() => {
				const { ref } = getElement();

				// pause if not in view.
				if (!inView) {
					ref.pause();
					return;
				}

				// Set the video src from data-src attribute.
				if (ref.dataset.src && !ref?.src) {
					ref.src = ref.dataset.src;
				}

				// load the video if not loaded.
				if (ref.readyState < 4) {
					ref.load();
				}

				// play the video if autoplay and muted.
				if (ref.autoplay && ref.muted) {
					ref.play();
				}
			}, [inView]);
		},

		// Handle the play event.
		handlePlay() {
			const { ref } = getElement();
			const context = getContext();

			// Try to find the current video element inside this container.
			const currentVideo = ref?.querySelector('video') ?? ref ?? null;

			// loaded, remove large play button.
			context.loaded = true;

			// Ensure the current video plays.
			currentVideo?.play();

			// pause other videos on the page unless they are autoplay/loop.
			Array.from(document.querySelectorAll('video'))
				.filter((v) => v !== currentVideo) // get other videos.
				.forEach((video) => {
					video.muted = true;
					!video.autoplay && video.pause();
				});
		},

		play() {
			const { ref } = getElement();

			// Get the stored video element for this container.
			const video = ref.querySelector('video');

			// no video element found.
			if (!video) {
				return;
			}

			// If already playing, pause it.
			if (!video?.paused) {
				video.pause();
				return;
			}

			video
				.play()
				.catch((error) =>
					console.warn('Video autoplay failed:', error)
				);
		},
	},
});
