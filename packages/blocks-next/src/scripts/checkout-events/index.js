/**
 * Process cart and checkout change events.
 */
export const processCheckoutEvents = (checkout, oldCheckout) => {
	// Process line items for added or quantity increased items
	(checkout?.line_items?.data || []).forEach((newItem) => {
		const oldItem = (oldCheckout?.line_items?.data || []).find(
			(item) => item.id === newItem.id
		);

		if (!oldItem || oldItem.quantity < newItem.quantity) {
			const event = new CustomEvent('scAddedToCart', {
				detail: {
					...newItem,
					quantity: newItem.quantity - (oldItem?.quantity || 0),
				},
				bubbles: true,
			});
			document.dispatchEvent(event);
		}
	});

	// Process line items for removed or quantity decreased items
	(oldCheckout?.line_items?.data || []).forEach((oldItem) => {
		const newItem = (checkout?.line_items?.data || []).find(
			(item) => item.id === oldItem.id
		);

		if (!newItem || oldItem.quantity > newItem.quantity) {
			const event = new CustomEvent('scRemovedFromCart', {
				detail: {
					...oldItem,
					quantity: oldItem.quantity - (newItem?.quantity || 0),
				},
				bubbles: true,
			});
			document.dispatchEvent(event);
		}
	});

	// Check if the cart has been updated
	if (
		JSON.stringify(checkout?.line_items?.data || []) !==
		JSON.stringify(oldCheckout?.line_items?.data || [])
	) {
		const event = new CustomEvent('scCartUpdated', {
			detail: {
				currentCart: checkout,
				previousCart: oldCheckout,
			},
			bubbles: true,
		});
		document.dispatchEvent(event);
	}
};

/**
 * Process cart view event.
 */
export const processCartViewEvent = (checkout) => {
	const event = new CustomEvent('scViewedCart', {
		detail: checkout,
		bubbles: true,
	});
	document.dispatchEvent(event);
};
