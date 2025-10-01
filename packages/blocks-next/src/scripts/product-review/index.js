/**
 * WordPress dependencies.
 */
import { store, getContext, getElement } from '@wordpress/interactivity';

/**
 * Internal dependencies.
 */
const { addQueryArgs } = wp.url; // TODO: replace with `@wordpress/url` when available.
const { sprintf, __ } = wp.i18n;

// controls the product page.
const { state, actions } = store('surecart/product-review', {
	state: {
		loading: false,
	},

	actions: {
		*addToCart(e) {
			const hasContextBusy = Object.values(e.submitter.dataset).includes(
				'context.busy'
			);

			// no busy context, toggle cart right away.
			!hasContextBusy && cartActions.open();

			const context = getContext();
			const { mode, formId, product } = context;
			try {
				context.busy = true;

				const { addCheckoutLineItem } = yield import(
					/* webpackIgnore: true */
					'@surecart/checkout-service'
				);

				const checkout = yield* addCheckoutLineItem(state.lineItem);
				checkoutActions.setCheckout(checkout, mode, formId);

				// no busy context, wait to toggle cart
				hasContextBusy && cartActions.open();

				// speak the cart dialog state.
				cartState.label = sprintf(
					/* translators: %s: product name */
					__('%s has been added to your cart.', 'surecart'),
					product?.name
				);
			} catch (e) {
				console.error(e);
			} finally {
				context.busy = false;
			}
		},
	},

	callbacks: {
		*init() {
			console.log('init');
		},
		handleSubmit() {
			console.log('handleSubmit');
			// prevent the form submission.
			return false;
		},
	},
});
