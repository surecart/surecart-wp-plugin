/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/react';
import { addQueryArgs } from '@wordpress/url';

const getEditUrl = (id) =>
	addQueryArgs('admin.php', {
		page: 'sc-product-groups',
		action: 'edit',
		id,
	});

export default ({ navigation } = {}) => ({
	id: 'name',
	label: __('Name', 'surecart'),
	enableSorting: true,
	enableGlobalSearch: true,
	render: ({ item }) => (
		<a
			href={getEditUrl(item?.id)}
			onClick={(e) => {
				e.preventDefault();
				navigation?.goToEdit(item?.id);
			}}
			css={css`
				font-weight: 600;
				color: var(--sc-color-gray-900);
				text-decoration: none;
				&:hover {
					color: var(--sc-color-primary-500);
				}
			`}
		>
			{item?.name || __('(no name)', 'surecart')}
		</a>
	),
});
