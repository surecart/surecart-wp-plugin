/** @jsx jsx */
import { css, jsx } from '@emotion/react';

/**
 * External dependencies.
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
 * Internal dependencies.
 */
import CollectionTemplateCreateModal from './create-modal';
import { getTemplateTitle } from '../../../products/utility';

export default function CollectionTemplateForm({
	onClose,
	collection,
	updateCollection,
	template,
}) {
	const { templates, defaultTemplate, canCreate, canEdit } = useSelect(
		(select) => {
			const { canUser, getEntityRecords } = select(coreStore);
			const selectorArgs = ['postType', 'wp_template', { per_page: -1 }];
			const templates = (getEntityRecords(...selectorArgs) || []).filter(
				(template) => {
					return (
						template.theme === 'surecart/surecart' ||
						template.slug.includes('sc-collections')
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
		(template) => template.id === collection?.metadata?.wp_template_id
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
					'Templates define the way product archive page is displayed when viewing your site.',
					'surecart'
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
				label={__('Template', 'surecart')}
				value={selected?.id || 'surecart/surecart//product-archive'}
				options={options}
				onChange={(slug) => {
					updateCollection({
						metadata: {
							...collection.metadata,
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
								'surecart/surecart//product-archive',
							canvas: 'edit',
						})}
					>
						{__('Edit template', 'surecart')}
					</Button>
				</p>
			)}

			{isCreateModalOpen && (
				<CollectionTemplateCreateModal
					template={defaultTemplate}
					collection={collection}
					updateCollection={updateCollection}
					onClose={() => setIsCreateModalOpen(false)}
				/>
			)}
		</div>
	);
}
