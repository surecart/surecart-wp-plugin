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
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import Box from '../../ui/Box';

export default ({ product, updateProduct, loading }) => {
	const { template, loadingTemplate } = useSelect(
		(select) => {
			const queryArgs = [
				'postType',
				'sc-product',
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
			footer={
				template?.id && (
					<ScButton
						href={addQueryArgs('post.php', {
							post: template?.id,
							action: 'edit',
						})}
					>
						<ScIcon slot="prefix" name="edit" />
						{__('Edit Template', 'surecart')}
					</ScButton>
				)
			}
		>
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
		</Box>
	);
};
