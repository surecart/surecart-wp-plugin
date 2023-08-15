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
import PostTemplateCreateModal from './create-modal';
import { getTemplateTitle } from '../../../products/utility';

export default function PostTemplateForm({
	onClose,
	template,
	collection,
	updateCollection,
}) {
	const { parts, defaultPart, canCreate } = useSelect(
		(select) => {
			const { canUser, getEntityRecords } = select(coreStore);
			const parts = (
				getEntityRecords('postType', 'wp_template_part', {
					per_page: -1,
				}) || []
			).filter((template) => {
				return (
					template.id ===
						'surecart/surecart//product-collection-part' ||
					template.slug.includes('sc-part-products-archive')
				);
			});
			return {
				parts,
				defaultPart: parts.find(
					(part) => part.theme === 'surecart/surecart'
				),
				canCreate: canUser('create', 'templates'),
			};
		},
		[template]
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
					'Templates define the way product collection page is displayed when viewing your site.',
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

			<div style={{ marginBottom: '16px' }}>
				<SelectControl
					label={__('Page Layout', 'surecart')}
					value={collection?.metadata?.wp_template_id || ''}
					options={Object.keys(scData?.availableTemplates || {}).map(
						(value) => {
							const label = scData?.availableTemplates[value];
							return {
								value,
								label,
							};
						}
					)}
					onChange={(slug) => {
						updateCollection({
							metadata: {
								...collection.metadata,
								wp_template_id: slug,
							},
						});
					}}
				/>
			</div>

			<SelectControl
				__nextHasNoMarginBottom
				label={__('Template', 'surecart')}
				value={
					template?.id || 'surecart/surecart//product-collection-part'
				}
				options={(parts ?? []).map((part) => {
					return {
						value: part?.id,
						label: getTemplateTitle(part),
					};
				})}
				onChange={(slug) => {
					updateCollection({
						metadata: {
							...collection.metadata,
							wp_template_part_id: slug,
						},
					});
				}}
			/>

			{canCreate && (
				<p>
					<Button
						variant="link"
						href={addQueryArgs('site-editor.php', {
							postType: 'wp_template_part',
							postId:
								template?.id ||
								'surecart/surecart//product-collection-part',
							canvas: 'edit',
						})}
					>
						{__('Edit template', 'surecart')}
					</Button>
				</p>
			)}

			{isCreateModalOpen && (
				<PostTemplateCreateModal
					template={defaultPart}
					collection={collection}
					updateCollection={updateCollection}
					onClose={() => setIsCreateModalOpen(false)}
				/>
			)}
		</div>
	);
}
