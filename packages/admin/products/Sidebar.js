/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScDivider,
	ScFormControl,
	ScInput,
	ScRadio,
	ScRadioGroup,
	ScSwitch,
} from '@surecart/components-react';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { format } from '@wordpress/date';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import Box from '../ui/Box';
import Definition from '../ui/Definition';
import Advanced from './modules/Advanced';
import Image from './modules/Image';
import Publishing from './modules/Publishing';
import Taxes from './modules/Tax';

export default ({
	id,
	loading,
	product,
	updateProduct,
	isSaving,
	onToggleArchiveProduct,
}) => {
	const { editEntityRecord } = useDispatch(coreStore);

	const { post } = useSelect(
		(select) => {
			const queryArgs = [
				'postType',
				'sc-product',
				{
					status: ['publish', 'future', 'draft'],
					meta: { sc_product_id: id },
				},
			];
			return {
				post:
					select(coreStore).getEntityRecords(...queryArgs)?.[0] ||
					null,
			};
		},
		[id]
	);

	return (
		<Fragment>
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
						{__('Summary', 'surecart')}
					</div>
				}
			>
				<Fragment>
					<Definition
						title={__('Available for purchase', 'surecart')}
					>
						<ScSwitch
							checked={!product?.archived}
							disabled={isSaving}
							onClick={(e) => {
								e.preventDefault();
								onToggleArchiveProduct();
							}}
						/>
					</Definition>

					{!!product?.archived_at && (
						<Definition
							css={css`
								margin-bottom: 1em;
							`}
							title={__('Archived On', 'surecart')}
						>
							{format(
								'F j, Y',
								new Date(product?.archived_at * 1000)
							)}
						</Definition>
					)}

					{!!product?.updated_at && (
						<Definition title={__('Last Updated', 'surecart')}>
							{format(
								'F j, Y',
								new Date(product.updated_at * 1000)
							)}
						</Definition>
					)}

					{!!product?.created_at && (
						<Definition title={__('Created On', 'surecart')}>
							{format(
								'F j, Y',
								new Date(product.created_at * 1000)
							)}
						</Definition>
					)}
				</Fragment>

				{!!post?.link && !!post?.slug && (
					<ScDivider style={{ '--spacing': '1em' }} />
				)}

				{!!post?.link && (
					<ScFormControl label={__('Permalink', 'surecart')}>
						<a href={post.link}>{post.link}</a>
					</ScFormControl>
				)}

				{!!post?.slug && (
					<ScInput
						label={__('URL Slug')}
						help={__('The last part of the URL', 'surecart')}
						value={post.slug}
						onScInput={(e) =>
							editEntityRecord(
								'postType',
								'sc-product',
								post?.id,
								{
									slug: e.target.value,
								}
							)
						}
					></ScInput>
				)}
			</Box>

			<Publishing
				id={id}
				product={product}
				updateProduct={updateProduct}
				loading={loading}
			/>

			<Taxes
				product={product}
				updateProduct={updateProduct}
				loading={loading}
			/>

			<Image
				product={product}
				updateProduct={updateProduct}
				loading={loading}
			/>

			<Advanced
				product={product}
				updateProduct={updateProduct}
				loading={loading}
			/>
		</Fragment>
	);
};
