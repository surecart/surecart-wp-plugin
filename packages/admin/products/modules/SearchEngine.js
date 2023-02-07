/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScHeading,
	ScInput,
	ScSelect,
	ScSwitch,
	ScText,
	ScTextarea,
} from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import Box from '../../ui/Box';

export default ({ loading, id, product, updateProduct }) => {
	if (!scData?.entitlements?.licensing) {
		return null;
	}

	const { downloads, fetching } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'download',
				{ context: 'edit', product_ids: [id], per_page: 100 },
			];
			return {
				downloads: select(coreStore).getEntityRecords(...queryArgs),
				fetching: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[id]
	);

	return (
		<Box
			loading={loading}
			title={
				<div
					css={css`
						display: flex;
						align-items: center;
						justify-content: space-between;
					`}
				>
					{__('Search Engine Listing', 'surecart')}
				</div>
			}
		>
			<div
				css={css`
					display: grid;
					gap: var(--sc-spacing-large);
				`}
			>
				{product?.page_title && product?.meta_description ? (
					<div>
						<ScText
							style={{
								'--color': 'var(--sc-color-info-800)',
							}}
						>
							{product.page_title}
						</ScText>
						<ScText
							style={{
								'--color': 'var(--sc-color-success-800)',
								'--font-size': 'var(--sc-font-size-small)',
								'--line-height': 'var(--sc-line-height-small)',
							}}
						>
							{`https://surecart.test/products`}
						</ScText>
						<ScText
							style={{
								'--color': 'var(--sc-color-gray-500)',
								'--font-size': 'var(--sc-font-size-small)',
								'--line-height': 'var(--sc-line-height-small)',
							}}
						>
							{product.meta_description}
						</ScText>
					</div>
				) : (
					<div>
						{__(
							'Add a title and description to see how this product might appear in a search engine listing',
							'surecart'
						)}
					</div>
				)}
				<ScInput
					label={__('Page title', 'surecart')}
					value={product?.page_title}
					onScInput={(e) => {
						updateProduct({ page_title: e.target.value });
					}}
					name="page_title"
					maxlength={70}
				/>
				<ScTextarea
					label={__('Meta description', 'surecart')}
					onScInput={(e) =>
						updateProduct({
							meta_description: e.target.value,
						})
					}
					value={product?.meta_description}
					name="meta_description"
					maxlength={320}
				/>
			</div>
		</Box>
	);
};
