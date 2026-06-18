/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/react';
import { addQueryArgs } from '@wordpress/url';
import { ScTag } from '@surecart/components-react';
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
			className="sc-product-name-cell"
			css={css`
				display: flex;
				align-items: center;
				gap: 12px;
				flex: 1;
				min-width: 150px;
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
					flex: 1;
					min-width: 0;
					font-weight: 600;
					font-size: var(--sc-font-size-medium, 14px);
					line-height: 1.4;
					color: var(--sc-color-gray-900);
					text-decoration: none;
					overflow: hidden;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					white-space: normal;
					word-break: break-word;
					&:hover {
						color: var(--sc-color-primary-500);
					}
				`}
			>
				{item?.name}{' '}
				{item?.archived && (
					<ScTag
						css={css`
							flex-shrink: 0;
						`}
						type="warning"
						size="small"
					>
						{__('Archived', 'surecart')}
					</ScTag>
				)}
			</a>
		</div>
	),
});
