import apiFetch from '@surecart/api-fetch';

const { addQueryArgs } = wp.url; // TODO: replace with `@wordpress/url` when available.
export const baseUrl = 'surecart/v1/checkouts/';

/** Items to always expand. */
export const expand = [
	'line_items',
	'line_item.price',
	'line_item.fees',
	'line_item.variant',
	'variant.image',
	'price.product',
	'product.featured_product_media',
	'product.product_collections',
	'product_media.media',
	'customer',
	'customer.shipping_address',
	'payment_intent',
	'discount',
	'discount.promotion',
	'recommended_bumps',
	'bump.price',
	'current_upsell',
	'product.variants',
	'discount.coupon',
	'shipping_address',
	'tax_identifier',
	'manual_payment_method',
	'shipping_choices',
	'shipping_choice.shipping_method',
];

export const parsePath = (id, endpoint = '') => {
	let path = id ? `${baseUrl}${id}` : baseUrl;
	path = `${path}${endpoint}`;
	return addQueryArgs(path, {
		expand,
	});
};

/**
 * Remove a line item.
 */
export const removeLineItem = async ({ checkoutId, itemId }) => {
	const { deleted } = await apiFetch({
		path: `surecart/v1/line_items/${itemId}`,
		method: 'DELETE',
	});

	if (!deleted) {
		throw { code: 'error', message: __('Failed to delete', 'surecart') };
	}

	return await fetchCheckout({ id: checkoutId });
};

/** Fethc a checkout by id */
export const fetchCheckout = async ({ id, query = {} }) => {
	return await apiFetch({
		path: addQueryArgs(parsePath(id), withDefaultQuery(query)),
	});
};

/** Default query we send with every request. */
export const withDefaultQuery = (query = {}) => ({
	// ...(!!checkoutState?.formId && { form_id: checkoutState?.formId }),
	// ...(!!checkoutState?.product?.id && { product_id: checkoutState?.product?.id }),
	...query,
});

// /**
//  * Update a line item.
//  */
// export const updateLineItem = async ({ id, data }) => {
// 	const item = await apiFetch({
// 		path: addQueryArgs(`surecart/v1/line_items/${id}`, {
// 			expand: [
// 				...(expand || []).map((item) => {
// 					return item.includes('.') ? item : `checkout.${item}`;
// 				}),
// 				'checkout',
// 			],
// 		}),
// 		method: 'PATCH',
// 		data,
// 	});

// 	return item?.checkout;
// };

// /**
//  * Update the checkout line item
//  */
// const updateCheckoutLineItem = async ({ id, data }) => {
// 	try {
// 		updateFormState('FETCH');
// 		state.checkout = await updateLineItem({
// 			id: id,
// 			data,
// 		});
// 		updateFormState('RESOLVE');
// 	} catch (e) {
// 		console.error(e);
// 		createErrorNotice(e);
// 		updateFormState('REJECT');
// 	}
// };

// /**
//  * Remove the checkout line item.
//  */
// const removeCheckoutLineItem = async (id) => {
// 	try {
// 		// updateFormState('FETCH');
// 		return await removeLineItem({
// 			checkoutId: state.checkout.id,
// 			itemId: id,
// 		});
// 		// updateFormState('RESOLVE');
// 	} catch (e) {
// 		console.error(e);
// 		// createErrorNotice(e);
// 		// updateFormState('REJECT');
// 	}
// };

// /**
//  * Add the checkout line item.
//  */
// const addCheckoutLineItem = async (data) => {
// 	try {
// 		// updateFormState('FETCH');
// 		state.checkout = await addLineItem({
// 			checkout: state.checkout,
// 			data,
// 			live_mode: state?.mode === 'live',
// 		});
// 		// updateFormState('RESOLVE');
// 	} catch (e) {
// 		console.error(e);
// 		createErrorNotice(e);
// 		updateFormState('REJECT');
// 	}
// };

// /** Create or update the checkout. */
// const createOrUpdateCheckout = async ({ id = null, data = {}, query = {} }) => {
// 	id = !id ? findInitialCheckoutId() : id;
// 	return await apiFetch({
// 		method: id ? 'PATCH' : 'POST', // create or update
// 		path: addQueryArgs(parsePath(id), withDefaultQuery(query)),
// 		data: withDefaultData(data),
// 	});
// };

// /** Update the checkout. */
// const updateCheckout = async ({ id, data = {}, query = {} }) => {
// 	return await apiFetch({
// 		method: 'PATCH',
// 		path: addQueryArgs(parsePath(id), withDefaultQuery(query)),
// 		data: withDefaultData(data),
// 	});
// };

// /** Finalize a checkout */
// const finalizeCheckout = async ({ id, data = {}, query = {}, processor }) => {
// 	return await apiFetch({
// 		method: 'POST',
// 		path: addQueryArgs(
// 			parsePath(id, '/finalize'),
// 			withDefaultQuery({
// 				...(processor?.manual
// 					? {
// 							manual_payment: true,
// 							manual_payment_method_id: processor?.id,
// 					  }
// 					: { processor_type: processor?.id }),
// 				...query,
// 			})
// 		),
// 		data: withDefaultData(data),
// 	});
// };

// /**
//  * Add a line item.
//  */
// const addLineItem = async ({ checkout, data, live_mode = false }) => {
// 	const existingLineItem = (checkout?.line_items?.data || []).find((item) => {
// 		if (!item?.variant?.id) {
// 			return item.price.id === data.price;
// 		}
// 		return item.variant.id === data.variant && item.price.id === data.price;
// 	});

// 	// create the checkout with the line item.
// 	if (!checkout?.id) {
// 		return await apiFetch({
// 			method: 'POST', // create
// 			path: addQueryArgs(parsePath(null)),
// 			data: {
// 				line_items: [data],
// 				live_mode,
// 			},
// 		});
// 	}

// 	// handle existing line item.
// 	if (!!existingLineItem) {
// 		return await updateLineItem({
// 			id: existingLineItem?.id,
// 			data: {
// 				...data,
// 				quantity: existingLineItem?.quantity + data?.quantity,
// 			},
// 		});
// 	}

// 	const item = await apiFetch({
// 		path: addQueryArgs(
// 			`surecart/v1/line_items/${
// 				existingLineItem?.id ? existingLineItem?.id : ''
// 			}`,
// 			{
// 				consolidate: true,
// 				expand: [
// 					...(expand || []).map((item) => {
// 						return item.includes('.') ? item : `checkout.${item}`;
// 					}),
// 					'checkout',
// 				],
// 			}
// 		),
// 		method: 'POST',
// 		data: {
// 			...data,
// 			checkout: checkout.id,
// 		},
// 	});

// 	return item?.checkout;
// };
