// Single source of the variants list query so every consumer (inline rows,
// edit drawer, invalidations) resolves the same core-data cache entry.
// core-data keys resolution by query *value*, so fresh objects are fine.
export const variantsQuery = (productId) => ({
	product_ids: [productId],
	per_page: 100,
	expand: ['image'],
});

// Platform-side sort support is unverified — order client-side.
export const byPosition = (a, b) => (a?.position ?? 0) - (b?.position ?? 0);
