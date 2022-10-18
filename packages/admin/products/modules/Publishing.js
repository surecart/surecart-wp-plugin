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
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import Box from '../../ui/Box';
import { useState } from 'react';
import { Button, Modal } from '@wordpress/components';

export default ({ id, product, post, loading }) => {
	const [busy, setBusy] = useState();
	const [error, setError] = useState();
	const { createSuccessNotice } = useDispatch(noticesStore);
	const { editEntityRecord, saveEntityRecord } = useDispatch(coreStore);
	const [modal, setModal] = useState();

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
					content:
						'<!-- wp:group {"align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull"><!-- wp:columns {"align":"wide","style":{"border":{"radius":"0px"}},"backgroundColor":"tertiary"} --><div class="wp-block-columns alignwide has-tertiary-background-color has-background" style="border-radius:0px"><!-- wp:column {"verticalAlignment":"center"} --><div class="wp-block-column is-vertically-aligned-center"><!-- wp:image {"id":1109,"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="https://surecart.test/wp-content/uploads/2022/10/white0950_768x_crop_center@2x.progressive-768x1024.webp" alt="" class="wp-image-1109"/></figure><!-- /wp:image --></div><!-- /wp:column --><!-- wp:column {"verticalAlignment":"center","width":"","style":{"spacing":{"padding":{"top":"30px","right":"30px","bottom":"30px","left":"30px"}}},"backgroundColor":"tertiary","layout":{"inherit":false}} --><div class="wp-block-column is-vertically-aligned-center has-tertiary-background-color has-background" style="padding-top:30px;padding-right:30px;padding-bottom:30px;padding-left:30px"><!-- wp:surecart/product-form --><!-- wp:surecart/product-title {"level":3,"textColor":"foreground","style":{"spacing":{"margin":{"top":"0px","right":"0px","bottom":"15px","left":"0px"}},"typography":{"fontStyle":"normal","fontWeight":"500"}}} /--><!-- wp:surecart/product-prices {"textColor":"vivid-purple"} /--><!-- wp:paragraph {"style":{"color":{"text":"#583a58"}}} --><p class="has-text-color" style="color:#583a58">The AO Curve-Hem Tee originally the Crew Curve-Hem, is our best-selling style designed for the modern professional to be "Always On."</p><!-- /wp:paragraph --><!-- wp:surecart/product-quantity {"label":"Quantity","fontSize":"small","style":{"spacing":{"margin":{"bottom":"20px"}},"border":{"radius":"92px"},"color":{"text":"#6e537d"}}} /--><!-- wp:surecart/product-cart-button {"style":{"border":{"radius":"100px"},"color":{"gradient":"linear-gradient(135deg,rgb(74,234,220) 0%,rgb(151,120,209) 20%,rgb(207,42,186) 40%,rgb(238,44,130) 60%,rgb(251,105,98) 80%,rgb(254,248,76) 96%)"}}} /--><!-- /wp:surecart/product-form --></div><!-- /wp:column --></div><!-- /wp:columns --></div><!-- /wp:group -->',
					meta: {
						sc_product_id: id,
					},
				},
				{
					throwOnError: true,
				}
			);
			createSuccessNotice(__('Product page created', 'surecart'), {
				type: 'snackbar',
			});
			setModal(false);
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
				<ScButton type="default" onClick={() => setModal(true)}>
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
			{modal && (
				<Modal
					title={__('Create a product page', 'surecart')}
					onRequestClose={() => setModal(false)}
					isFullScreen
				>
					<p>List of templates</p>
					<Button isPrimary onClick={createPost} isBusy={busy}>
						{__('Create Page', 'surecart')}
					</Button>
				</Modal>
			)}
		</Box>
	);
};
