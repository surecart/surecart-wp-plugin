/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/react';
import { addQueryArgs } from '@wordpress/url';

const customerEditUrl = (id) =>
	addQueryArgs('admin.php', {
		page: 'sc-customers',
		action: 'edit',
		id,
	});

export default () => ({
	id: 'customer',
	label: __('Customer', 'surecart'),
	enableSorting: false,
	getValue: ({ item }) => item?.customer?.name || item?.customer?.email || '',
	render: ({ item }) => {
		const customer = item?.customer;
		if (!customer) return '-';
		const label = customer.name || customer.email || '-';
		if (!customer.id) return label;
		return (
			<a
				href={customerEditUrl(customer.id)}
				css={css`
					color: var(--sc-color-primary-500);
					text-decoration: none;
					&:hover {
						text-decoration: underline;
					}
				`}
			>
				{label}
			</a>
		);
	},
});
