// URL ↔ filter mapping. Defaults are excluded from the URL.
export const GROUPS_URL_FILTERS = [
	{
		field: 'archive_status',
		urlKey: 'status',
		operator: 'is',
		defaultValue: 'active',
	},
];
