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

/** Fethc a checkout by id */
export const fetchCheckout = async ({ id, query = {} }) => {
	return await apiFetch({
		path: addQueryArgs(parsePath(id), withDefaultQuery(query)),
	});
};

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
export const updateLineItem = async ({ id, data }) => {
	const item = await apiFetch({
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

/**
 * Update the checkout line item
 */
export const updateCheckoutLineItem = async ({ id, data }) => {
	try {
		checkoutState.loading = true;
		return await updateLineItem({
			id,
			data,
		});
	} catch (e) {
		console.error(e);
	} finally {
		checkoutState.loading = false;
	}
};

/**
 * Remove the checkout line item.
 */
export const removeCheckoutLineItem = async (id) => {
	try {
		checkoutState.loading = true;
		return await removeLineItem({
			checkoutId: checkoutState?.checkout?.id,
			itemId: id,
		});
	} catch (e) {
		console.error(e);
	} finally {
		checkoutState.loading = false;
	}
};

/**
 * Add the checkout line item.
 */
export const addCheckoutLineItem = async (data) => {
	try {
		checkoutState.loading = true;
		return await addLineItem({
			checkout: checkoutState.checkout,
			data,
			live_mode: checkoutState?.mode === 'live',
		});
	} catch (e) {
		console.error(e);
	} finally {
		checkoutState.loading = false;
	}
};

/** Create or update the checkout. */
export const createOrUpdateCheckout = async ({
	id = null,
	data = {},
	query = {},
}) => {
	id = id ?? getSessionId();
	return await apiFetch({
		method: id ? 'PATCH' : 'POST', // create or update
		path: addQueryArgs(parsePath(id), withDefaultQuery(query)),
		data: withDefaultData(data),
	});
};

/** Update the checkout. */
export const updateCheckout = async ({ data = {}, query = {} }) => {
	const id = data?.id ?? getSessionId();
	return await apiFetch({
		method: 'PATCH',
		path: addQueryArgs(parsePath(id), withDefaultQuery(query)),
		data: withDefaultData(data),
	});
};

/** Finalize a checkout */
export const finalizeCheckout = async ({
	id,
	data = {},
	query = {},
	processor,
}) => {
	return await apiFetch({
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
};

/**
 * Add a line item.
 */
export const addLineItem = async ({ checkout, data, live_mode = false }) => {
	const existingLineItem = (checkout?.line_items?.data || []).find((item) => {
		if (!item?.variant?.id) {
			return item.price.id === data.price;
		}
		return item.variant.id === data.variant && item.price.id === data.price;
	});

	// create the checkout with the line item.
	if (!checkout?.id) {
		return await apiFetch({
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
		return await updateLineItem({
			id: existingLineItem?.id,
			data: {
				...data,
				quantity: existingLineItem?.quantity + data?.quantity,
			},
		});
	}

	const item = await apiFetch({
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
};

/**
 * Convert line items to a line item data.
 */
export const convertLineItemsToLineItemData = (lineItems) => {
	return (lineItems?.data || []).map((item) => {
		return {
			...(!!item?.id ? { id: item.id } : {}),
			variant_id: item.variant?.id,
			price_id: item.price.id,
			quantity: item.quantity,
		};
	});
};

/**
 * Find a line item by it's price and variant.
 */
export const getLineItemByPriceAndVariant = (priceId, variantId = null) => {
	const lineItem = (checkoutState?.checkout?.line_items?.data || []).find(
		(item) => {
			return variantId
				? item.variant?.id === variantId && item.price?.id === priceId
				: item.price?.id === priceId;
		}
	);

	if (!lineItem?.id) {
		return false;
	}

	return {
		id: lineItem?.id,
		price_id: lineItem?.price?.id,
		quantity: lineItem?.quantity,
		variant_id: lineItem?.variant?.id,
	};
};

/**
 * Add a line item to the checkout from Add to Cart Button.
 */
export const handleAddToCartByPriceOrVariant = async (data) => {
	const { formId, mode, priceId, variantId } = getContext();

	// get the current line item from the price id.
	const lineItem = getLineItemByPriceAndVariant(priceId, variantId);

	// convert line items response to line items post.
	let existingData = convertLineItemsToLineItemData(
		checkoutState?.checkout?.line_items || []
	);

	// Line item does not exist. Add it.
	return await createOrUpdateCheckout({
		id: checkoutState?.checkout?.id,
		data: {
			live_mode: mode === 'live',
			line_items: [
				...(existingData || [])
					.map((item) => {
						// if the price ids match (we have already a line item)
						if (priceId === item?.price_id) {
							const priceOrVariantMatches = variantId
								? item.price_id === priceId &&
								  item.variant_id === variantId
								: item.price_id === priceId;

							if (priceOrVariantMatches) {
								return {
									...item,
									...(!!data?.ad_hoc_amount
										? { ad_hoc_amount: data?.ad_hoc_amount }
										: {}),
									...(!!data?.variant_id
										? { variant_id: data?.variant_id }
										: {}),
									quantity: !item?.ad_hoc_amount
										? item?.quantity + 1
										: 1, // only increase quantity if not ad_hoc.
								};
							}
							// return item.
							return item;
						}
						return item;
					})
					.filter((item) => item !== null), // Filter out any nulls that might have been added
				// add a line item if one does not exist.
				...(!lineItem
					? [
							{
								price_id: priceId,
								variant_id: variantId,
								...(!!data?.ad_hoc_amount
									? { ad_hoc_amount: data?.ad_hoc_amount }
									: {}),
								quantity: 1,
							},
					  ]
					: []),
			],
		},
		query: {
			form_id: formId,
		},
	});
};

export const handleCouponApply = async (promotionCode) => {
	try {
		checkoutState.loading = true;
		return await updateCheckout({
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
	} catch (error) {
		console.error(error);
		checkoutState.error = error;
	} finally {
		checkoutState.loading = false;
	}
};
