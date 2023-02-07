/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { grid } from '@wordpress/icons';
import { Button, Placeholder } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { InnerBlocks } from '@wordpress/block-editor';

import { DEFAULT_PRODUCT_ITEM_LAYOUT } from '../consts';

export default function EditLayoutConfig() {
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
							template={DEFAULT_PRODUCT_ITEM_LAYOUT}
							allowedBlocks={DEFAULT_PRODUCT_ITEM_LAYOUT}
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
