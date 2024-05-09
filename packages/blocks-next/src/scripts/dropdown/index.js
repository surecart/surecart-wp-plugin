/**
 * WordPress dependencies
 */
import { store, getContext, getElement } from '@wordpress/interactivity';

const { actions } = store('surecart/dropdown', {
	state: {
		get selectedOptionLabel() {
			const context = getContext();
			return context.selectedItem?.label || 'label';
		},
		get isMenuItemSelected() {
			const context = getContext();
			return context.selectedItem?.value === context.value;
		},
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

		// Close menu on click outside.
		closeOnClickOutside: (e) => {
			const context = getContext();
			// if the click is inside button or on button then return
			if (
				e &&
				(e.target?.classList?.contains('sc-dropdown__trigger') ||
					e.target?.closest('.sc-dropdown__trigger'))
			)
				return;
			if (e && e.target.closest('.surecart-dropdown')) return;
			if (!context.isMenuOpen) return;
			context.isMenuOpen = false;
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
});
