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
import { getTemplateTitle } from '../../../util/templates';

export default function PostTemplateForm({
	onClose,
	upsell,
	updateUpsell,
	template,
}) {
	// template parts.
	const { parts, defaultPart, canCreate } = useSelect(
		(select) => {
			const { canUser, getEntityRecords } = select(coreStore);
			const parts = (
				getEntityRecords('postType', 'wp_template_part', {
					per_page: -1,
				}) || []
			).filter((template) => {
				return (
					template.id === 'surecart/surecart//upsell-info' ||
					template.slug.includes('sc-part-upsell-info')
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
					'Templates define the way this bump is displayed when viewing your site.'
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
					value={upsell?.metadata?.wp_template_id || ''}
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
						updateUpsell({
							metadata: {
								...upsell.metadata,
								wp_template_id: slug,
							},
						});
					}}
				/>
			</div>

			<SelectControl
				__nextHasNoMarginBottom
				label={__('Template')}
				value={template?.id || 'surecart/surecart//upsell-info'}
				options={(parts ?? []).map((part) => {
					return {
						value: part?.id,
						label: getTemplateTitle(part),
					};
				})}
				onChange={(slug) => {
					updateUpsell({
						metadata: {
							...upsell.metadata,
							wp_template_part_id: slug,
						},
					});
				}}
			/>

			{/* {canCreate && (
				<p>
					<Button
						variant="link"
						href={addQueryArgs('site-editor.php', {
							postType: 'wp_template_part',
							postId:
								template?.id ||
								'surecart/surecart//upsell-info',
							canvas: 'edit',
						})}
					>
						{__('Manage All Template Parts')}
					</Button>
				</p>
			)} */}

			{isCreateModalOpen && (
				<PostTemplateCreateModal
					template={defaultPart}
					upsell={upsell}
					updateUpsell={updateUpsell}
					onClose={() => setIsCreateModalOpen(false)}
				/>
			)}
		</div>
	);
}
