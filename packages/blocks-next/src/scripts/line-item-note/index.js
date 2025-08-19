/**
 * WordPress dependencies.
 */
import { store, getContext } from '@wordpress/interactivity';

const { __ } = wp.i18n;

/**
 * Line item note store.
 */
store('surecart/line-item-note', {
	state: {
		/**
		 * Show the line item note "more"/ "less" button if the note is longer than 40 characters.
		 */
		get showLineItemNoteToggle() {
			const { line_item } = getContext();
			return line_item?.note?.length > 40;
		},

		/**
		 * Is the line item note expanded?
		 */
		get lineItemNoteExpanded() {
			const { line_item, expandedNotes } = getContext();
			if (!line_item?.id) return false;

			return expandedNotes?.[line_item.id] || false;
		},

		/**
		 * Get the line item note button aria label for accessibility.
		 */
		get lineItemNoteAriaLabel() {
			const { line_item } = getContext();
			if (!line_item?.note) {
				return '';
			}

			const expanded = store('surecart/line-item-note').state.lineItemNoteExpanded;
			return expanded
				? __('Collapse note', 'surecart')
				: __('Expand note', 'surecart');
		},

		/**
		 * Get unique ID for the line item note element.
		 */
		get lineItemNoteId() {
			const { line_item } = getContext();
			return `line-item-note-${line_item?.id}`;
		},
	},

	actions: {
		/**
		 * Toggle the line item note expanded state.
		 */
		toggleLineItemNote() {
			const context = getContext();
			const { line_item } = context;
			
			if (!line_item?.id || !line_item?.note) {
				return;
			}

			// Initialize expandedNotes if it doesn't exist
			if (!context.expandedNotes) {
				context.expandedNotes = {};
			}

			// Toggle the expanded state
			context.expandedNotes = {
				...context.expandedNotes,
				[line_item.id]: !(context.expandedNotes?.[line_item.id] || false),
			};
		},

		/**
		 * Stop propagation and toggle the line item note expanded state.
		 */
		stopPropagationAndToggle(e) {
			e.stopPropagation();
			store('surecart/line-item-note').actions.toggleLineItemNote();
		},
	},
});