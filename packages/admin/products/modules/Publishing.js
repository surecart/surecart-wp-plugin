/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScButton,
	ScDivider,
	ScIcon,
	ScInput,
	ScRadio,
	ScRadioGroup,
	ScFormControl,
} from '@surecart/components-react';
import { addQueryArgs } from '@wordpress/url';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import Box from '../../ui/Box';
import SelectTemplate from '../components/SelectTemplate';

export default ({ product, updateProduct, loading }) => {
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
				<ScFormControl label={__('Permalink', 'surecart')}>
					<a href={`https://surecart.test/product/${product.id}`}>
						https://surecart.test/product/spectra
					</a>
				</ScFormControl>
				<ScInput
					label={__('URL Slug')}
					help={__('The last part of the URL', 'surecart')}
					value={'spectra'}
					onScInput={(e) => {}}
				/>

				<ScRadioGroup
					onScChange={(e) => {
						updateProduct({ status: e.target.value });
					}}
				>
					<ScRadio
						checked={product?.status !== 'publish'}
						value="draft"
						name="publishing"
					>
						{__('Draft', 'surecart')}
					</ScRadio>
					<ScRadio
						checked={product?.status === 'publish'}
						value="publish"
						name="publishing"
					>
						{__('Published', 'surecart')}
					</ScRadio>
				</ScRadioGroup>
				<div>
					<SelectTemplate
						label={__('Template', 'surecart')}
						value={product?.metadata?.wp_template_id || 'default'}
						onSelect={(id) =>
							updateProduct({
								metadata: {
									...(product?.metadata || {}),
									wp_template_id: id,
								},
							})
						}
					/>
					{template?.wp_id && (
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
