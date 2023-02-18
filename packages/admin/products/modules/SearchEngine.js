/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScInput, ScText, ScTextarea } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';

import Box from '../../ui/Box';

export default ({ loading, product, updateProduct }) => {
	const metaData = product?.metadata || {};

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
				{metaData.page_title && metaData.meta_description ? (
					<div>
						<ScText
							style={{
								'--color': 'var(--sc-color-info-800)',
							}}
						>
							{metaData.page_title}
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
							{metaData.meta_description}
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
					value={metaData.page_title}
					onScInput={(e) => {
						updateProduct({
							metadata: {
								...metaData,
								page_title: e.target.value,
							},
						});
					}}
					name="page_title"
					maxlength={70}
				/>
				<ScTextarea
					label={__('Meta description', 'surecart')}
					onScInput={(e) =>
						updateProduct({
							metadata: {
								...metaData,
								meta_description: e.target.value,
							},
						})
					}
					value={metaData.meta_description}
					name="meta_description"
					maxlength={320}
				/>
			</div>
		</Box>
	);
};
