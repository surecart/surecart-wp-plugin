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
import CreateModal from './create-modal';
import { useDispatch } from '@wordpress/data';

export default function PostTemplateForm({
	onClose,
	collection,
	updateCollection,
	template,
}) {
	const { editEntityRecord } = useDispatch(coreStore);

	const { templates, defaultTemplate, canCreate, canEdit } = useSelect(
		(select) => {
			const { canUser, getEntityRecords } = select(coreStore);
			const selectorArgs = ['postType', 'wp_template', { per_page: -1 }];
			const templates = getEntityRecords(...selectorArgs) || [];
			const { taxonomy, slug } = collection?.term;
			const defaultTemplateId = select(coreStore).getDefaultTemplateId({
				slug: slug
					? `taxonomy-${taxonomy}-${slug}`
					: `taxonomy-${taxonomy}`,
			});
			return {
				templates: templates.filter((template) => {
					const slug = template?.slug || '';
					return slug.includes('sc-product-collection');
				}),
				defaultTemplate: select(coreStore).getEditedEntityRecord(
					'postType',
					'wp_template',
					defaultTemplateId
				),
				canCreate: canUser('create', 'templates'),
				canEdit: canUser('create', 'templates'),
			};
		},
		[collection?.term]
	);

	const options = (templates ?? [])
		.map((template) => ({
			value: template?.slug,
			label:
				template?.title?.rendered || template?.title || template?.slug,
		}))
		.filter(
			(option, index, self) =>
				index === self.findIndex((t) => t.value === option.value)
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
					'Templates define the way this product collection is displayed when viewing your site.'
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
				value={template?.slug}
				options={[
					{
						value: '',
						label:
							defaultTemplate?.title?.rendered ||
							defaultTemplate?.title ||
							defaultTemplate?.slug,
					},
					...options,
				]}
				onChange={(slug) => {
					editEntityRecord(
						'taxonomy',
						'sc_collection',
						collection?.id,
						{ template: slug },
						{ undoIgnore: true }
					);
					// needed to make sure sync does not overwrite the template
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
								template?.id ||
								'surecart/surecart//taxonomy-sc_collection',
							canvas: 'edit',
						})}
					>
						{__('Edit template')}
					</Button>
				</p>
			)}

			{isCreateModalOpen && (
				<CreateModal
					template={defaultTemplate}
					collection={collection}
					updateCollection={updateCollection}
					onClose={() => setIsCreateModalOpen(false)}
				/>
			)}
		</div>
	);
}
