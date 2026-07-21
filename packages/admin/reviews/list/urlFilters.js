// URL ↔ filter mapping. Defaults are excluded from the URL.
export const REVIEWS_URL_FILTERS = [
	{
		field: 'status',
		urlKey: 'status',
		operator: 'is',
		defaultValue: 'all',
	},
	{
		field: 'product',
		urlKey: 'sc_product',
		operator: 'isAny',
		multiple: true,
	},
	{
		field: 'stars',
		urlKey: 'stars',
		operator: 'isAny',
		multiple: true,
	},
];
