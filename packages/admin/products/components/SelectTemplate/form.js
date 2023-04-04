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

/**
 * Internal dependencies
 */
import PostTemplateCreateModal from './create-modal';

export default function PostTemplateForm({ onClose }) {
	const { templates, selectedTemplateSlug, canCreate, canEdit } = useSelect(
		(select) => {
			const { canUser, getEntityRecords } = select(coreStore);
			const canCreateTemplates = canUser('create', 'templates');
			return {
				templates:
					getEntityRecords('postType', 'wp_template', {
						per_page: -1,
					}) || [],
				selectedTemplateSlug: 'test',
				canCreate: canCreateTemplates,
				canEdit: canCreateTemplates,
			};
		},
		[]
	);

	console.log({ templates });

	const options = (templates ?? []).map(({ slug, title }) => ({
		value: slug,
		label: title?.rendered || slug,
	}));

	const selectedOption =
		options.find((option) => option.value === selectedTemplateSlug) ??
		options.find((option) => !option.value); // The default option has '' value.

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
				value={selectedOption?.value ?? ''}
				options={options}
				onChange={(slug) => {
					//editPost({ template: slug || '' })
				}}
			/>

			{canEdit && (
				<p>
					<Button
						variant="link"
						onClick={() => __unstableSwitchToTemplateMode()}
					>
						{__('Edit template')}
					</Button>
				</p>
			)}

			{isCreateModalOpen && (
				<PostTemplateCreateModal
					onClose={() => setIsCreateModalOpen(false)}
				/>
			)}
		</div>
	);
}
