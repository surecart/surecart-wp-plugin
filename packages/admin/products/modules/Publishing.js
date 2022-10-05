/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScRadio, ScRadioGroup } from '@surecart/components-react';
import { store as sureCartStore } from '@surecart/data';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import Box from '../../ui/Box';

export default ({ id }) => {
	const { editEntityRecord } = useDispatch(coreStore);

	const { post, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'postType',
				'sc_product',
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
		// if it's future, set the date.

		// if it's now, remove the date?
		editEntityRecord('postType', 'sc_product', post?.id, {
			status,
		});
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
		>
			<ScRadioGroup
				label={__('Publish product page', 'surecart')}
				onScChange={(e) => updatePost(e.target.value)}
			>
				<ScRadio
					checked={!['future', 'published'].includes(post?.status)}
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
