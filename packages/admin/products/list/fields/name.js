/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/react';
import { addQueryArgs } from '@wordpress/url';
import ProductThumbnail from '../../components/ProductThumbnail';

const getEditUrl = (id) =>
	addQueryArgs('admin.php', {
		page: 'sc-products',
		action: 'edit',
		id,
	});

export default ({ navigation } = {}) => ({
	id: 'name',
	label: __('Name', 'surecart'),
	enableSorting: true,
	enableGlobalSearch: true,
	getValue: ({ item }) => item?.name || '',
	render: ({ item }) => (
		<div
			css={css`
				display: flex;
				align-items: center;
				gap: 12px;
				min-width: 0;
			`}
		>
			<ProductThumbnail product={item} />
			<a
				href={getEditUrl(item?.id)}
				title={item?.name}
				onClick={(e) => {
					e.preventDefault();
					navigation?.goToEdit(item?.id);
				}}
				css={css`
					font-weight: 600;
					font-size: var(--sc-font-size-medium, 14px);
					color: var(--sc-color-gray-900);
					text-decoration: none;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					min-width: 0;
					&:hover {
						color: var(--sc-color-primary-500);
					}
				`}
			>
				{item?.name}
			</a>
		</div>
	),
});
