/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { grid } from '@wordpress/icons';
import { Button, Placeholder } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { InnerBlocks } from '@wordpress/block-editor';

const PRODUCT_ITEM_BLOCKS = [
	[
		'surecart/product-list-title',
		{
			title: 'Product Title',
		},
	],
	[
		'surecart/product-list-image',
		{
			src: 'https://images.unsplash.com/photo-1617360547704-3da8b5363369?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=420&ixid=MnwxfDB8MXxyYW5kb218MHx8cHJvZHVjdHx8fHx8fDE2NzU3OTY4NjM&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=360',
			sizing: 'contain',
		},
	],
];

const ALLOWED_BLOCKS = ['surecart/product-list-title'];

export default function EditLayoutConfig({ onDone }) {
	return (
		<Placeholder icon={grid} label={__('All Products', 'surecart')}>
			<div
				css={css`
					display: flex;
					flex-direction: column;
					flex: 1 0 0px;
				`}
			>
				{__(
					'Display all products from your store as a grid.',
					'surecart'
				)}
				<div
					css={css`
						margin-top: 2rem;
						padding: 1rem;
						background-color: var(--sc-color-gray-200);
					`}
				>
					<div
						style={{
							backgroundColor: 'white',
							maxWidth: '22rem',
							minHeight: '22rem',
							margin: '0 auto',
							padding: '1rem',
						}}
					>
						<InnerBlocks
							templateLock={'insert'}
							template={PRODUCT_ITEM_BLOCKS}
							allowedBlocks={ALLOWED_BLOCKS}
							renderAppender={false}
						/>
					</div>
				</div>
				<div
					css={css`
						display: flex;
						justify-content: flex-end;
						padding: 1rem 1rem 0;
					`}
				>
					<Button
						variant="primary"
						style={{ marginBottom: 0 }}
						onClick={onDone}
					>
						{__('Done', 'surecart')}
					</Button>
				</div>
			</div>
		</Placeholder>
	);
}
