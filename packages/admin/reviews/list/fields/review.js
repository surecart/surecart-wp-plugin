/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/react';
import { addQueryArgs } from '@wordpress/url';

const getEditUrl = (id) =>
	addQueryArgs('admin.php', {
		page: 'sc-reviews',
		action: 'edit',
		id,
	});

const SOFT_LIMIT = 120;

const truncate = (text) => {
	if (!text) return '';
	const trimmed = String(text).trim();
	return trimmed.length > SOFT_LIMIT
		? trimmed.substring(0, SOFT_LIMIT).trimEnd() + '…'
		: trimmed;
};

export default ({ navigation } = {}) => ({
	id: 'review',
	label: __('Review', 'surecart'),
	enableSorting: false,
	enableGlobalSearch: true,
	getValue: ({ item }) => item?.title || '',
	render: ({ item }) => (
		<div
			css={css`
				display: flex;
				flex-direction: column;
				gap: 4px;
				min-width: 0;
			`}
		>
			<div
				css={css`
					display: inline-flex;
					align-items: center;
					gap: 6px;
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
						&:hover {
							color: var(--sc-color-primary-500);
						}
					`}
				>
					{item?.title || __('(no title)', 'surecart')}
				</a>
				{!!item?.verified && (
					<sc-tooltip
						text={__('Verified Buyer', 'surecart')}
						type="text"
						css={css`
							display: inline-flex;
							align-items: center;
						`}
					>
						<sc-icon
							name="verified"
							css={css`
								font-size: 16px;
								color: var(--sc-color-success-500);
							`}
						></sc-icon>
					</sc-tooltip>
				)}
			</div>
			{item?.body && (
				<div
					css={css`
						color: var(--sc-color-gray-600);
						font-size: 13px;
						line-height: 1.4;
					`}
				>
					{truncate(item.body)}
				</div>
			)}
		</div>
	),
});
