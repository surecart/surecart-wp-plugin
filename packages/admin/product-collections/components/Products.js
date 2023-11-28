/** @jsx jsx */
import { css, jsx } from '@emotion/react';

/**
 * External dependencies
 */
import { Button, PanelRow } from '@wordpress/components';
import { addQueryArgs } from '@wordpress/url';
import { __, sprintf, _n } from '@wordpress/i18n';

export default ({ collection }) => {
	return (
		<PanelRow
			css={css`
				align-items: flex-start;
				justify-content: space-between;
				width: 100%;
			`}
		>
			<span
				css={css`
					display: block;
					flex-shrink: 0;
					padding: 6px 0;
					width: 45%;
				`}
			>
				{__('Products', 'surecart')}
			</span>
			<Button
				href={addQueryArgs('admin.php', {
					page: 'sc-products',
					sc_collection: collection?.id,
				})}
				css={css`
					height: auto;
					text-align: right;
				`}
				variant="tertiary"
			>
				{sprintf(
					_n(
						'%d Product',
						'%d Products',
						collection?.products_count,
						'surecart'
					),
					collection?.products_count
				)}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={2}
					stroke="currentColor"
					width="13"
					height="13"
					style={{
						fill: 'none',
						color: 'var(--sc-color-gray-300)',
						marginLeft: '6px',
						flex: '1 0 18px',
					}}
				>
					<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
					<polyline points="15 3 21 3 21 9"></polyline>
					<line x1="10" y1="14" x2="21" y2="3"></line>
				</svg>
			</Button>
		</PanelRow>
	);
};
