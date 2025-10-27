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
				const context = getContext();
				if (inView) {
					// Set the video src from data-src attribute.
					if (ref.dataset.src && !ref?.src) {
						ref.src = ref.dataset.src;
					}
					if (ref.readyState < 4) {
						ref.load();
					}
					if (ref.autoplay && ref.muted) {
						ref.play();
					}
				} else {
					ref.pause();
				}
			}, [inView]);
		},

		// Handle the play event.
		handlePlay() {
			const { ref } = getElement();
			const context = getContext();

			// Try to find the current video element inside this container.
			const currentVideo = ref?.querySelector('video') ?? ref ?? null;

			// loaded, remove large play b  utton.
			context.loaded = true;

			// Ensure the current video is playing.
			currentVideo?.play();

			// pause other videos on the page unless they are autoplay/loop.
			Array.from(document.querySelectorAll('video'))
				.filter((v) => v !== currentVideo) // get other videos.
				.forEach((video) => {
					video.muted = true;
					if (!video.autoplay) {
						video.pause();
					}
				});
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

			video.play().catch((error) => {
				console.warn('Video autoplay failed:', error);
			});
		},
	},
});
