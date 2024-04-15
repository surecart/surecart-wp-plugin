/**
 * WordPress dependencies
 */
import { store, getContext, getElement } from '@wordpress/interactivity';

// controls the dropdown.
const { state, callbacks, actions } = store('surecart/dropdown', {
	state: {
		get getSelectedOptionLabel() {
			const context = getContext();
			return context.selectedItem?.label;
		},
		get shouldHideOption() {
			const context = getContext();
			return (
				context.selectedItem?.value ===
				getElement().ref.current.dataset.value
			);
		},
		get isMenuItemSelected() {
			const context = getContext();
			return context.selectedItem?.value === context.value;
		},
	},
	actions: {
		toggleMenu: (e) => {
			e.preventDefault();
			const context = getContext();
			context.isMenuOpen = !context.isMenuOpen;
		},
		closeMenu: (e) => {
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
		selectItem: (e) => {
			const context = getContext();
			context.selectedItem = {
				label: context.label,
				value: context.value,
			};
			context.isMenuOpen = false;
			e.target
				.closest('.sc-dropdown')
				.querySelector('.sc-dropdown__trigger')
				.focus();
		},
		menuItemKeyUp: (e) => {
			const context = getContext();
			if (e.key === 'Enter') {
				actions.selectItem(e);
			}
			if (e.key === 'Escape') {
				context.isMenuOpen = false;
				e.target
					.closest('.sc-dropdown')
					.querySelector('.sc-dropdown__trigger')
					.focus();
			}
			if (e.key === 'ArrowDown') {
				e.target.nextElementSibling?.focus();
			}
			if (e.key === 'ArrowUp') {
				e.target.previousElementSibling?.focus();
			}
		},
		triggerKeyUp: (e) => {
			e.preventDefault();
			const context = getContext();
			if (e.key === ' ') {
				context.isMenuOpen = !context.isMenuOpen;
			}
			if (e.key === 'Escape') {
				context.isMenuOpen = false;
			}
			if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
				context.isMenuOpen = true;
				const firstMenuItem =
					getElement().ref.parentElement.querySelector(
						'.sc-dropdown__menu-item'
					);
				setTimeout(() => {
					if (firstMenuItem) {
						firstMenuItem.focus();
					}
				});
			}
		},
		hoverMenuItem: (e) => {
			const context = getContext();
			context.focused = !context.focused;
		},
	},
	callbacks: {
		shouldHideOption: (e) => {
			const context = getContext();
			const { ref } = getElement();
			return context.selectedItem?.value === ref.current.dataset.value;
		},
	},
});
