/** @jsx jsx */
import { css, jsx } from '@emotion/react';
/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { __experimentalInspectorPopoverHeader as InspectorPopoverHeader } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { addTemplate } from '@wordpress/icons';
import { SelectControl, Button } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies
 */
import PostTemplateCreateModal from './create-modal';

export default function PostTemplateForm({
	onClose,
	product,
	updateProduct,
	template,
}) {
	const { templates, canCreate } = useSelect((select) => {
		const { canUser, getEntityRecords } = select(coreStore);
		return {
			templates:
				getEntityRecords('postType', 'wp_template', {
					per_page: -1,
					post_type: 'surecart-product',
				}) || [],
			canCreate: canUser('create', 'templates'),
		};
	}, []);

	const canEdit =
		canCreate && (!!scData?.is_block_theme || !!template?.wp_id);

	const options = (templates ?? []).map(({ id, title, wp_id }) => ({
		value: id,
		label: `${title?.rendered || slug}${
			!wp_id ? ` (${__('Default', 'surecart')})` : ''
		}`,
	}));

	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

	return (
		<div
			css={css`
				min-width: 248px;
				margin: 8px;

				.block-editor-inspector-popover-header {
					margin-bottom: 16px;
				}
				[class].block-editor-inspector-popover-header__action.has-icon {
					min-width: 24px;
					padding: 0;
				}
				[class].block-editor-inspector-popover-header__action {
					height: 24px;
				}
			`}
		>
			<InspectorPopoverHeader
				title={__('Template')}
				help={__(
					'Templates define the way this product is displayed when viewing your site.'
				)}
				actions={
					canCreate
						? [
								{
									icon: addTemplate,
									label: __('Add template'),
									onClick: () => setIsCreateModalOpen(true),
								},
						  ]
						: []
				}
				onClose={onClose}
			/>

			<SelectControl
				__nextHasNoMarginBottom
				hideLabelFromVision
				label={__('Template')}
				value={product?.metadata?.wp_template_id}
				options={options}
				onChange={(slug) => {
					updateProduct({
						metadata: {
							...product.metadata,
							wp_template_id: slug,
						},
					});
				}}
			/>

			{canEdit && (
				<p>
					<Button
						variant="link"
						href={
							scData?.is_block_theme
								? addQueryArgs('site-editor.php', {
										postType: 'wp_template',
										postId: product?.metadata
											?.wp_template_id,
										canvas: 'edit',
								  })
								: addQueryArgs('post.php', {
										post: template?.wp_id,
										action: 'edit',
								  })
						}
						target="_blank"
					>
						{__('Edit template')}
					</Button>
				</p>
			)}

			{isCreateModalOpen && (
				<PostTemplateCreateModal
					template={template}
					product={product}
					updateProduct={updateProduct}
					onClose={() => setIsCreateModalOpen(false)}
				/>
			)}
		</div>
	);
}
