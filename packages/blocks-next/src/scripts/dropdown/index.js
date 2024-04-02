/**
 * WordPress dependencies
 */
import { store, getContext, getElement } from '@wordpress/interactivity';

// controls the dropdown.
store('surecart/dropdown', {
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
	},
	actions: {
		toggleMenu: () => {
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
				label: e.target.dataset.label,
				value: e.target.dataset.value,
			};
			context.isMenuOpen = false;
		},
	},
	callbacks: {
		shouldHideOption: (e) => {
			console.log(e);
			const context = getContext();
			const { ref } = getElement();
			console.log(ref);
			console.log(
				'context.selectedItem?.value',
				context.selectedItem?.value
			);
			console.log('ref.current.dataset.value', ref.current.dataset.value);
			return context.selectedItem?.value === ref.current.dataset.value;
		},
	},
});
