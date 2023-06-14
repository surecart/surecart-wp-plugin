/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScDivider,
	ScFormControl,
	ScInput,
	ScSwitch,
} from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { format } from '@wordpress/date';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import Box from '../../ui/Box';
import Definition from '../../ui/Definition';

export default ({
	loading,
	product,
	post,
	isSaving,
	onToggleArchiveProduct,
}) => {
	const { editEntityRecord } = useDispatch(coreStore);
	return (
		<Box loading={loading} title={__('Summary', 'surecart')}>
			<Fragment>
				<Definition title={__('Available for purchase', 'surecart')}>
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
						{format('F j, Y', new Date(product.updated_at * 1000))}
					</Definition>
				)}

				{!!product?.created_at && (
					<Definition title={__('Created On', 'surecart')}>
						{format('F j, Y', new Date(product.created_at * 1000))}
					</Definition>
				)}
			</Fragment>

			{!!post?.link && (
				<>
					<ScDivider style={{ '--spacing': '1em' }} />
					<ScFormControl label={__('Permalink', 'surecart')}>
						<a href={post.link}>{post.link}</a>
					</ScFormControl>
					<ScInput
						label={__('URL Slug')}
						help={__('The last part of the URL', 'surecart')}
						value={post?.slug}
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
				</>
			)}
		</Box>
	);
};
