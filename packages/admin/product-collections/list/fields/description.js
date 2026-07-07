import { __ } from '@wordpress/i18n';

const stripHtml = (html) => {
	if (typeof window === 'undefined' || !window.DOMParser) {
		// Fallback for non-DOM environments (tests, SSR).
		return html.replace(/<[^>]*>/g, '');
	}
	const doc = new window.DOMParser().parseFromString(html, 'text/html');
	return doc.body.textContent || '';
};

const SOFT_LIMIT = 80;

export default () => ({
	id: 'description',
	label: __('Description', 'surecart'),
	enableSorting: false,
	getValue: ({ item }) => (item?.description ? stripHtml(item.description) : ''),
	render: ({ item }) => {
		if (!item?.description) return '-';
		const stripped = stripHtml(item.description).trim();
		if (!stripped) return '-';
		return stripped.length > SOFT_LIMIT
			? stripped.substring(0, SOFT_LIMIT).trimEnd() + '…'
			: stripped;
	},
});
