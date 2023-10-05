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
import { getTemplateTitle } from '../../utility';

export default function PostTemplateForm({
	onClose,
	product,
	updateProduct,
	template,
}) {
	const { templates, defaultTemplate, canCreate, canEdit } = useSelect(
		(select) => {
			const { canUser, getEntityRecords } = select(coreStore);
			const selectorArgs = ['postType', 'wp_template', { per_page: -1 }];
			const templates = (getEntityRecords(...selectorArgs) || []).filter(
				(template) => {
					return (
						template.id === 'surecart/surecart//single-product' ||
						template.slug.includes('sc-products')
					);
				}
			);
			return {
				templates,
				defaultTemplate: templates.find(
					(template) => template.theme === 'surecart/surecart'
				),
				canCreate: canUser('create', 'templates'),
				canEdit: canUser('create', 'templates'),
			};
		},
		[]
	);

	const options = (templates ?? []).map((template) => ({
		value: template?.id,
		label: getTemplateTitle(template),
	}));

	const selected = templates.find(
		(template) => template.id === product?.metadata?.wp_template_id
	);

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
					canCreate && [
						{
							icon: addTemplate,
							label: __('Add Template', 'surecart'),
							onClick: () => setIsCreateModalOpen(true),
						},
					]
				}
				onClose={onClose}
			/>

			<SelectControl
				__nextHasNoMarginBottom
				hideLabelFromVision
				label={__('Template')}
				value={selected?.id || 'surecart/surecart//single-product'}
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
						href={addQueryArgs('site-editor.php', {
							postType: 'wp_template',
							postId:
								selected?.id ||
								'surecart/surecart//single-product',
							canvas: 'edit',
						})}
					>
						{__('Edit template')}
					</Button>
				</p>
			)}

			{isCreateModalOpen && (
				<PostTemplateCreateModal
					template={defaultTemplate}
					product={product}
					updateProduct={updateProduct}
					onClose={() => setIsCreateModalOpen(false)}
				/>
			)}
		</div>
	);
}
