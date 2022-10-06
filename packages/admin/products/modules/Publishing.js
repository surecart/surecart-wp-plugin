/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScButton,
	ScIcon,
	ScRadio,
	ScRadioGroup,
} from '@surecart/components-react';
import { addQueryArgs } from '@wordpress/url';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import Box from '../../ui/Box';

export default ({ id, product }) => {
	const { editEntityRecord, saveEntityRecord } = useDispatch(coreStore);

	const { post, loading } = useSelect(
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
				loading: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[id]
	);

	const updatePost = (status) => {
		let date = null;

		// if it's switched from draft, maybe let's create one.
		if (status === 'future') {
		}

		// if it's future, set the date.

		if (post?.id) {
			// if it's now, remove the date?
			editEntityRecord('postType', 'sc-product', post?.id, {
				status,
				date,
			});
		} else {
			saveEntityRecord(
				~'postType',
				'sc-product',
				{
					status,
					date,
					title: product?.name,
				},
				{
					meta: { sc_product_id: id },
				}
			);
		}
	};

	return (
		<Box
			loading={loading && !post?.id}
			title={
				<div
					css={css`
						display: flex;
						align-items: center;
						justify-content: space-between;
					`}
				>
					{__('Publishing', 'surecart')}
				</div>
			}
			footer={
				post?.id && (
					<ScButton
						href={addQueryArgs('post.php', {
							post: post?.id,
							action: 'edit',
						})}
					>
						<ScIcon slot="prefix" name="edit" />
						{__('Edit Page Layout', 'surecart')}
					</ScButton>
				)
			}
		>
			<ScRadioGroup
				label={__('Publish product page', 'surecart')}
				onScChange={(e) => updatePost(e.target.value)}
			>
				<ScRadio
					checked={!['future', 'publish'].includes(post?.status)}
					value="draft"
				>
					{__("Don't publish", 'surecart')}
				</ScRadio>
				<ScRadio checked={post?.status === 'future'} value="future">
					{__('Schedule', 'surecart')}
				</ScRadio>
				<ScRadio checked={post?.status === 'publish'} value="publish">
					{__('Immediately', 'surecart')}
				</ScRadio>
			</ScRadioGroup>
		</Box>
	);
};
