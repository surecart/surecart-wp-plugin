/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScButton,
	ScIcon,
	ScInput,
	ScRadio,
	ScRadioGroup,
	ScFormControl,
	ScDivider,
} from '@surecart/components-react';
import { addQueryArgs } from '@wordpress/url';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';

import Box from '../../ui/Box';
import SelectTemplate from '../components/SelectTemplate';

export default ({ product, updateProduct, loading }) => {
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);

	const copy = async (text) => {
		try {
			await navigator.clipboard.writeText(text);
			createSuccessNotice(__('Copied to clipboard.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (err) {
			console.error(err);
			createErrorNotice(__('Error copying to clipboard.', 'surecart'), {
				type: 'snackbar',
			});
		}
	};

	const { template, loadingTemplate } = useSelect(
		(select) => {
			const queryArgs = [
				'postType',
				'wp_template',
				product?.metadata?.wp_template_id, // || default template id.
			];
			return {
				template: select(coreStore).getEditedEntityRecord(...queryArgs),
				loading: select(coreStore).isResolving(
					'getEditedEntityRecord',
					queryArgs
				),
			};
		},
		[product?.metadata?.wp_template_id]
	);

	return (
		<Box
			loading={loading || loadingTemplate}
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
			<div
				css={css`
					display: grid;
					gap: var(--sc-spacing-large);
				`}
			>
				<ScRadioGroup
					label={__('Status', 'surecart')}
					onScChange={(e) => {
						updateProduct({ status: e.target.value });
					}}
				>
					<ScRadio
						checked={product?.status !== 'published'}
						value="draft"
						name="publishing"
					>
						{__('Draft', 'surecart')}
					</ScRadio>
					<ScRadio
						checked={product?.status === 'published'}
						value="published"
						name="publishing"
					>
						{__('Published', 'surecart')}
					</ScRadio>
				</ScRadioGroup>

				<ScInput
					label={__('URL Slug', 'surecart')}
					help={__('The last part of the URL', 'surecart')}
					value={product?.slug}
					onScInput={(e) => updateProduct({ slug: e.target.value })}
					required
				/>

				<ScInput
					label={__('Permalink', 'surecart')}
					readonly
					value={`${scData?.home_url}/${scData?.product_page_slug}/${product?.slug}`}
				>
					<ScButton
						type="text"
						slot="suffix"
						onClick={() =>
							copy(
								`${scData?.home_url}/${scData?.product_page_slug}/${product?.slug}`
							)
						}
					>
						<ScIcon name="copy" />
					</ScButton>
				</ScInput>

				<ScDivider />
				<div>
					<SelectTemplate
						label={__('Template', 'surecart')}
						value={
							product?.metadata?.wp_template_id ||
							'surecart/surecart//single-product'
						}
						onSelect={(id) =>
							updateProduct({
								metadata: {
									...(product?.metadata || {}),
									wp_template_id: id,
								},
							})
						}
					/>
					{!!template?.wp_id && (
						<ScButton
							href={addQueryArgs('post.php', {
								post: template?.wp_id,
								action: 'edit',
							})}
							type="link"
						>
							{__('Edit Template', 'surecart')}
							<ScIcon slot="suffix" name="edit" />
						</ScButton>
					)}
				</div>
			</div>
		</Box>
	);
};
