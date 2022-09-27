export function selectPricesByProductId(state, productId) {
	return Object.fromEntries(
		Object.entries(state?.entities?.prices || {}).filter(
			([_, value]) => value.product === productId
		)
	);
}
export function selectPricesByIds(state, priceIds = []) {
	return Object.fromEntries(
		Object.entries(state?.entities?.prices || {}).filter(([_, value]) => {
			return priceIds.includes(value.id);
		})
	);
}
export function selectPricesById(state, id) {
	return state?.entities?.products?.[id];
}
export function selectProductById(state, id) {
	return state?.entities?.products?.[id];
}
export function selectEntityRecord(state, type, id) {
	return state[type][id];
}
export function selectAllProducts(state) {
	return state?.entities?.products || {};
}
export function searchProducts(state, query) {
	return state?.entities?.products || {};
}
