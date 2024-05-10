import { store, getElement, getContext } from '@wordpress/interactivity';

// controls the quantity selector
store('surecart/quantity-selector', {
	callbacks: {
		onChange: () => {
			const { ref } = getElement();

			const context = getContext();
			context.quantity = Math.max(
				Math.min(context.max, parseInt(ref.value)),
				context.min
			);
		},
		decrease: () => {
			const context = getContext();
			if (context.disabled) return;

			context.quantity = Math.max(context.min, context.quantity - 1);
		},
		increase: () => {
			const context = getContext();
			if (context.disabled) return;

			context.quantity = Math.min(context.max, context.quantity + 1);
		},
	},
});
