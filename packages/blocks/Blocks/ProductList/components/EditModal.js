/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { grid } from '@wordpress/icons';
import { Button, Placeholder } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { InnerBlocks } from '@wordpress/block-editor';

const ALLOWED_BLOCKS = [
	'surecart/product-title',
	'surecart/product-price',
	'surecart/product-image',
];

const DEFAULT_TEMPLATE = [
	[
		'surecart/product-title',
		{
			text: 'Product Title',
		},
	],
	[
		'surecart/product-price',
		{
			amount: '$249.99',
			scratchAmount: '$300',
		},
	],
	[
		'surecart/product-image',
		{
			src: 'https://i.picsum.photos/id/295/300/400.jpg?hmac=46TmcFytDsif4HXrwWO87IpjgeODl2xffBYSfNtezDQ',
			alt: 'Image Alt',
			sizing: 'cover',
		},
	],
];

export default function EditModal() {
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
							templateLock={false}
							template={DEFAULT_TEMPLATE}
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
					<Button variant="primary" style={{ marginBottom: 0 }}>
						{__('Done', 'surecart')}
					</Button>
					<Button variant="tertiary">
						{__('Cancel', 'surecart')}
					</Button>
				</div>
			</div>
		</Placeholder>
	);
}
