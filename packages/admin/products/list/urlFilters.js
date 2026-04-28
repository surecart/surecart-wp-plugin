// URL ↔ filter mapping for the products list. Defaults are excluded from the
// URL on purpose so a freshly-loaded list has a clean
// `/admin.php?page=sc-products`.
export const PRODUCTS_URL_FILTERS = [
	{
		field: 'archive_status',
		urlKey: 'status',
		operator: 'is',
		defaultValue: 'active',
	},
	{
		field: 'product_collections',
		urlKey: 'sc_collection',
		operator: 'isAny',
		multiple: true,
	},
];
