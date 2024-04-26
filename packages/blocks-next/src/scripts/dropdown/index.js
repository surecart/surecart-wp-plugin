/**
 * WordPress dependencies
 */
import { store, getContext, getElement } from '@wordpress/interactivity';

const { actions } = store('surecart/dropdown', {
	state: {
		get getSelectedOptionLabel() {
			const context = getContext();
			return context.selectedItem?.label;
		},
		get isMenuItemSelected() {
			const context = getContext();
			return context.selectedItem?.value === context.value;
		},
		get isMenuItemFocused() {
			const context = getContext();
			return context.activeMenuItemId === context.id;
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
				label: context.label || context.options[context.index].label,
				value: context.value || context.options[context.index].value,
			};
			context.isMenuOpen = false;
			e.target
				.closest('.sc-dropdown')
				.querySelector('.sc-dropdown__trigger')
				.focus();
		},
		menuKeyUp: (e) => {
			e.preventDefault();
			const context = getContext();
			const dropdown = getElement().ref;
			if (e.key === 'Enter') {
				actions.selectItem(e);
			}
			if (e.key === 'Escape') {
				context.isMenuOpen = false;
				dropdown.querySelector('.sc-dropdown__trigger').focus();
			}
			if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
				const isArrowDown = e.key === 'ArrowDown';
				const newIndex = isArrowDown
					? Math.min(context.index + 1, context.totalOptions - 1)
					: Math.max(context.index - 1, 0);

				dropdown
					?.querySelector(`#sc-menu-item-${context.index}`)
					?.classList.remove('sc-focused');
				context.index = newIndex;
				context.activeMenuItemId = `sc-menu-item-${context.index}`;
				dropdown
					?.querySelector(`#${context.activeMenuItemId}`)
					?.classList.add('sc-focused');
			}
		},
		menuKeyDown: (e) => {
			e.preventDefault();
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
			}
		},
	},
});
