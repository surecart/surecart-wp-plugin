/**
 * WordPress dependencies.
 */
import apiFetch from '@surecart/api-fetch';
import { store, getContext } from '@wordpress/interactivity';

const { addQueryArgs, getQueryArg } = wp.url; // TODO: replace with `@wordpress/url` when available.
export const baseUrl = 'surecart/v1/checkouts/';

const { state: checkoutState } = store('surecart/checkout');

/** Items to always expand. */
export const expand = [
	'line_items',
	'line_item.price',
	'line_item.fees',
	'line_item.variant',
	'variant.image',
	'price.product',
	'price.current_swap',
	'line_item.swap',
	'swap.swap_price',
	'product.featured_product_media',
	'product.product_collections',
	'product.product_medias',
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

/** Fetch a checkout by id */
export function* fetchCheckout({ id, query = {} }) {
	return yield apiFetch({
		path: addQueryArgs(parsePath(id), withDefaultQuery(query)),
	});
}

export const withDefaultData = (data) => {
	const context = getContext();
	return {
		live_mode: context.mode !== 'test',
		group_key: checkoutState.groupId,
		abandoned_checkout_enabled: checkoutState.abandonedCheckoutEnabled,
		metadata: {
			...(data?.metadata || {}),
			...(window?.scData?.page_id && {
				page_id: window?.scData?.page_id,
			}),
			...(checkoutState?.product?.id && {
				buy_page_product_id: checkoutState?.product?.id,
			}),
			page_url: window.location.href,
		},
		...(checkoutState?.checkout?.email && {
			email: checkoutState?.checkout?.email,
		}),
		...data,
	};
};

/** Default query we send with every request. */
export const withDefaultQuery = (query = {}) => {
	const context = getContext();
	return {
		...(!!context?.formId && { form_id: context?.formId }),
		...(!!checkoutState?.product?.id && {
			product_id: checkoutState?.product?.id,
		}),
		...query,
	};
};

export const getSessionId = () => {
	// check url first.
	const checkoutId = getQueryArg(window.location.href, 'checkout_id');
	if (!!checkoutId) {
		return checkoutId;
	}

	// check existing order.
	if (checkoutState?.checkout?.id) {
		return checkoutState?.checkout?.id;
	}

	// we don't have and order id.
	return null;
};

/**
 * Update a line item.
 */
export function* updateLineItem({ id, data }) {
	const item = yield apiFetch({
		path: addQueryArgs(`surecart/v1/line_items/${id}`, {
			expand: [
				...(expand || []).map((item) => {
					return item.includes('.') ? item : `checkout.${item}`;
				}),
				'checkout',
			],
		}),
		method: 'PATCH',
		data,
	});

	return item?.checkout;
}

/**
 * Update the checkout line item
 */
export function* updateCheckoutLineItem({ id, data }) {
	try {
		checkoutState.loading = true;
		return yield* updateLineItem({
			id,
			data,
		});
	} catch (e) {
		console.error(e);
		checkoutState.error = e;
		// nullify checkout.
		if (e.code === 'line_item.invalid') {
			return null;
		}
	} finally {
		checkoutState.loading = false;
	}
}

/**
 * Remove a line item.
 */
export function* removeLineItem({ checkoutId, itemId }) {
	const { deleted } = yield apiFetch({
		path: `surecart/v1/line_items/${itemId}`,
		method: 'DELETE',
	});

	return { deleted };
}

/**
 * Remove the checkout line item.
 */
export function* removeCheckoutLineItem(id) {
	try {
		checkoutState.loading = true;
		const { deleted } = yield* removeLineItem({
			checkoutId: checkoutState?.checkout?.id,
			itemId: id,
		});

		if (!deleted) {
			throw {
				code: 'error',
				message: __('Failed to delete', 'surecart'),
			};
		}

		return yield* fetchCheckout({ id: checkoutState?.checkout?.id });
	} catch (e) {
		console.error(e);
		checkoutState.error = e;
		// nullify checkout.
		console.log(e.code);
		if (e.code === 'line_item.invalid') {
			return null;
		}
	} finally {
		checkoutState.loading = false;
	}
}

/**
 * Toggle a swap
 */
export function* toggleSwap({ id, action = 'swap' }) {
	const context = getContext();
	try {
		checkoutState.loading = true;
		const item = yield apiFetch({
			path: addQueryArgs(`surecart/v1/line_items/${id}/${action}`, {
				expand: [
					...(expand || []).map((item) => {
						return item.includes('.') ? item : `checkout.${item}`;
					}),
					'checkout',
				],
			}),
			method: 'PATCH',
		});
		return item?.checkout;
	} catch (e) {
		console.error(e);
		checkoutState.error = e;
	} finally {
		checkoutState.loading = false;
	}
}

/**
 * Add a line item.
 */
export function* addLineItem({ checkout, data, live_mode = false }) {
	const existingLineItem = (checkout?.line_items?.data || []).find((item) => {
		if (!item?.variant?.id) {
			return item.price.id === data.price;
		}
		return item.variant.id === data.variant && item.price.id === data.price;
	});

	// create the checkout with the line item.
	if (!checkout?.id) {
		return yield apiFetch({
			method: 'POST', // create
			path: addQueryArgs(parsePath(null)),
			data: {
				line_items: [data],
				live_mode,
			},
		});
	}

	// handle existing line item.
	if (!!existingLineItem) {
		return yield* updateLineItem({
			id: existingLineItem?.id,
			data: {
				...data,
				quantity: existingLineItem?.quantity + data?.quantity,
			},
		});
	}

	const item = yield apiFetch({
		path: addQueryArgs(
			`surecart/v1/line_items/${
				existingLineItem?.id ? existingLineItem?.id : ''
			}`,
			{
				consolidate: true,
				expand: [
					...(expand || []).map((item) => {
						return item.includes('.') ? item : `checkout.${item}`;
					}),
					'checkout',
				],
			}
		),
		method: 'POST',
		data: {
			...data,
			checkout: checkout.id,
		},
	});

	return item?.checkout;
}

/**
 * Add the checkout line item.
 */
export function* addCheckoutLineItem(data) {
	const context = getContext();
	try {
		checkoutState.loading = true;
		return yield* addLineItem({
			checkout: checkoutState.checkout,
			data,
			live_mode: context.mode !== 'test',
		});
	} catch (e) {
		console.error(e);
		checkoutState.error = e;
	} finally {
		checkoutState.loading = false;
	}
}

/** Create or update the checkout. */
export function* createOrUpdateCheckout({ id = null, data = {}, query = {} }) {
	id = id ?? getSessionId();
	return yield apiFetch({
		method: id ? 'PATCH' : 'POST', // create or update
		path: addQueryArgs(parsePath(id), withDefaultQuery(query)),
		data: withDefaultData(data),
	});
}

/** Update the checkout. */
export function* updateCheckout({ data = {}, query = {} }) {
	const id = data?.id ?? getSessionId();
	return yield apiFetch({
		method: 'PATCH',
		path: addQueryArgs(parsePath(id), withDefaultQuery(query)),
		data: withDefaultData(data),
	});
}

/** Finalize a checkout */
export function* finalizeCheckout({ id, data = {}, query = {}, processor }) {
	return yield apiFetch({
		method: 'POST',
		path: addQueryArgs(
			parsePath(id, '/finalize'),
			withDefaultQuery({
				...(processor?.manual
					? {
							manual_payment: true,
							manual_payment_method_id: processor?.id,
					  }
					: { processor_type: processor?.id }),
				...query,
			})
		),
		data: withDefaultData(data),
	});
}

/**
 * Handle the coupon apply. Applies for both add/remove coupon.
 */
export function* handleCouponApply(promotionCode) {
	try {
		checkoutState.loading = true;
		return yield* updateCheckout({
			data: {
				discount: {
					...(promotionCode
						? {
								promotion_code: promotionCode,
						  }
						: {}),
				},
			},
		});
	} catch (e) {
		console.error(e);
		checkoutState.error = e;
	} finally {
		checkoutState.loading = false;
	}
}
