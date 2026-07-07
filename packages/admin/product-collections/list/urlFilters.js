// URL ↔ filter mapping. Defaults are excluded from the URL.
export const COLLECTIONS_URL_FILTERS = [
	{
		field: 'products_count',
		urlKey: 'sc_product',
		operator: 'isAny',
		multiple: true,
	},
];
