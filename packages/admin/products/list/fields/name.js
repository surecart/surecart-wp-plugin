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

// Used in table + list views (DataViews renders the field as the row's
// "name" column or as the list-row title region). Inline thumbnail is OK
// here because grid/list views use a separate `display_name` field as
// `titleField` to avoid duplicating the card image.
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
				white-space: normal;
			`}
		>
			<ProductThumbnail product={item} />
			<div
				css={css`
					min-width: 0;
					overflow: hidden;
				`}
			>
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
						word-break: break-word;
						&:hover {
							color: var(--sc-color-primary-500);
						}
					`}
				>
					{item?.name}
				</a>
			</div>
		</div>
	),
});
