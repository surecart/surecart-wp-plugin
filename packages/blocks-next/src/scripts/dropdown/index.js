/**
 * WordPress dependencies
 */
import { store, getContext, getElement } from '@wordpress/interactivity';

const { actions } = store('surecart/dropdown', {
	state: {
		get isMenuItemFocused() {
			const context = getContext();
			const element = getElement();
			return context.activeMenuItemId === element.attributes.id;
		},
	},

	actions: {
		// Toggle the menu.
		toggleMenu: (e) => {
			e.preventDefault();
			const context = getContext();
			context.isMenuOpen = !context.isMenuOpen;
		},

		// Select item programmatically.
		selectItem: () => {
			const context = getContext();
			const dropdown = getElement().ref;
			dropdown.querySelector('#' + context.activeMenuItemId).click();
		},

		// Handle keyup event.
		menuKeyUp: (e) => {
			const context = getContext();
			const dropdown = getElement().ref;
			const options = dropdown.querySelectorAll('[role="menuitem"]');

			// escape closes the menu.
			if (e.key === 'Escape') {
				e.preventDefault();
				context.isMenuOpen = false;
			}

			// enter key may open the menu or select the item.
			if (e.key === 'Enter') {
				e.preventDefault();
				// open the menu if closed.
				if (!context.isMenuOpen) {
					context.isMenuOpen = true;
					context.index = 0;
					context.activeMenuItemId =
						options?.[0]?.attributes?.id?.value;
					return;
				}
				actions.selectItem(e);
			}

			// arrow keys navigate the menu.
			if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
				e.preventDefault();

				// open the menu if closed.
				if (!context.isMenuOpen) {
					context.isMenuOpen = true;
					context.index = 0;
					context.activeMenuItemId =
						options?.[0]?.attributes?.id?.value;
					return;
				}

				// navigate the menu items.
				const isArrowDown = e.key === 'ArrowDown';
				context.index = isArrowDown
					? Math.min(context.index + 1, options?.length - 1)
					: Math.max(context.index - 1, 0);

				context.activeMenuItemId =
					options[context.index].attributes.id.value;
			}
		},

		menuKeyDown: (e) => {
			if (['ArrowDown', 'ArrowUp', 'Enter', 'Escape'].includes(e.key)) {
				e.preventDefault();
			}
		},
	},

	callbacks: {
		// Close the menu when focused outside
		maybeCloseMenu: (e) => {
			const context = getContext();
			const { ref } = getElement();

			// close on escape key.
			if (e?.key === 'Escape') {
				context.isMenuOpen = false;
				return;
			}

			// if the focus or click is outside the dropdown, close the menu.
			if (!ref.contains(e.target)) {
				context.isMenuOpen = false;
			}
		},
	},
});
