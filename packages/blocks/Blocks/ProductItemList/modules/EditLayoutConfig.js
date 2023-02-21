/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { grid } from '@wordpress/icons';
import { Button, Placeholder } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { InnerBlocks } from '@wordpress/block-editor';

const PRODUCT_BLOCKS = [
	[
		'surecart/product-item',
		{
			style: {
				spacing: {
					padding: {
						top: '0.88rem',
						bottom: '0.88rem',
						left: '0.88rem',
						right: '0.88rem',
					},
					margin: {
						top: 0,
						bottom: 0,
						left: 0,
						right: 0,
					},
				},
				border: {
					width: '1px',
					radius: '4px',
				},
				borderColor: 'cyan-bluish-gray',
			},
		},
	],
];

const ALLOWED_BLOCKS = ['surecart/product-item'];

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
							padding: '1.2rem',
						}}
					>
						<InnerBlocks
							templateLock={'insert'}
							template={PRODUCT_BLOCKS}
							allowedBlocks={ALLOWED_BLOCKS}
							renderAppender={false}
						/>
					</div>
				</div>
				<div
					css={css`
						display: flex;
						justify-content: flex-end;
						padding: 1rem 0 0;
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
