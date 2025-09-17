/**
 * WordPress dependencies.
 */
import {
	store,
	getContext,
	getElement,
	useEffect,
} from '@wordpress/interactivity';

/**
 * Check if the key is not submit key.
 */
const isNotKeySubmit = (e) => {
	return e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ';
};

/**
 * Line item note store.
 */
store('surecart/line-item-note', {
	actions: {
		toggleNoteExpanded(e) {
			if (isNotKeySubmit(e)) {
				return true;
			}

			const context = getContext();
			if (!context) {
				return;
			}

			context.noteExpanded = !context.noteExpanded;
		},
	},

	callbacks: {
		init() {
			const context = getContext();

			useEffect(() => {
				const { ref } = getElement();
				if (!ref || !context) return;

				const noteTextElement = ref.querySelector(
					'.line-item-note__text'
				);
				if (!noteTextElement) {
					context.showToggle = false;
					return;
				}

				const checkOverflow = () => {
					context.showToggle =
						!!context.noteExpanded ||
						noteTextElement.scrollHeight >
							noteTextElement.clientHeight;
				};

				checkOverflow();

				// Create ResizeObserver.
				const resizeObserver = new ResizeObserver(checkOverflow);
				resizeObserver.observe(noteTextElement);

				// Cleanup ResizeObserver.
				return () => resizeObserver.disconnect();
			}, []);
		},
	},
});
