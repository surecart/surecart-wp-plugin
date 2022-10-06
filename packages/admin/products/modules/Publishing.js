/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScBlockUi,
	ScButton,
	ScIcon,
	ScRadio,
	ScRadioGroup,
} from '@surecart/components-react';
import { addQueryArgs } from '@wordpress/url';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import Box from '../../ui/Box';
import { useState } from 'react';

export default ({ id, product, post, loading }) => {
	const [busy, setBusy] = useState();
	const [error, setError] = useState();
	const { editEntityRecord, saveEntityRecord } = useDispatch(coreStore);

	/** Create the product post. */
	const createPost = async () => {
		try {
			setBusy(true);
			setError(null);
			await saveEntityRecord(
				'postType',
				'sc-product',
				{
					status: 'draft',
					title: product?.name,
					meta: {
						sc_product_id: id,
					},
				},
				{
					throwOnError: true,
				}
			);
		} catch (e) {
			console.error(e);
			setError(e?.message || __('Something went wrong', 'surecart'));
		} finally {
			setBusy(false);
		}
	};

	const updatePost = (status) => {
		let date = null;

		// if it's switched from draft, maybe let's create one.
		if (status === 'future') {
		}

		// if it's now, remove the date?
		editEntityRecord('postType', 'sc-product', post?.id, {
			status,
			date,
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
			{!post?.id ? (
				<ScButton type="default" onClick={createPost}>
					<ScIcon name="shopping-bag" slot="prefix" />
					{__('Create Product Page', 'surecart')}
				</ScButton>
			) : (
				<ScRadioGroup
					label={__('Public product page', 'surecart')}
					onScChange={(e) => updatePost(e.target.value)}
				>
					<ScRadio
						checked={!['future', 'publish'].includes(post?.status)}
						value="draft"
						name="publishing"
					>
						{__('Draft', 'surecart')}
					</ScRadio>
					<ScRadio
						checked={post?.status === 'future'}
						value="future"
						name="publishing"
					>
						{__('Scheduled', 'surecart')}
					</ScRadio>
					<ScRadio
						checked={post?.status === 'publish'}
						value="publish"
						name="publishing"
					>
						{__('Published', 'surecart')}
					</ScRadio>
				</ScRadioGroup>
			)}
			{!!busy && <ScBlockUi spinner />}
		</Box>
	);
};
