export const componentProductOf = (item) =>
	typeof item?.component_product === 'object' &&
	item?.component_product !== null
		? item.component_product
		: null;

export const componentProductIdOf = (item) =>
	componentProductOf(item)?.id ||
	(typeof item?.component_product === 'string'
		? item.component_product
		: null);

export const normalizeBundleItem = (it) => {
	const cleaned = {
		...(it.id ? { id: it.id } : {}),
		component_product: componentProductIdOf(it),
		quantity: it.quantity,
		...(it.position !== undefined ? { position: it.position } : {}),
	};

	// `basis_amount` may legitimately be null (= even split by quantity), so
	// include it only when explicitly set, to avoid clobbering an existing
	// server value with an explicit null we didn't mean to send.
	if (it.basis_amount !== undefined) {
		cleaned.basis_amount = it.basis_amount;
	}
	return cleaned;
};
