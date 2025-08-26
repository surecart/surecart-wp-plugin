/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';

import Box from '../../ui/Box';
import { ScSelect, ScButton, ScIcon } from '@surecart/components-react';
import PostTemplateCreateModal from '../components/SelectTemplate/create-modal';
import PostTemplatePartCreateModal from '../components/SelectTemplatePart/create-modal';
import { getTemplateTitle } from '../utility';

export default ({ product, updateProduct, post, loading }) => {
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const { editEntityRecord } = useDispatch(coreStore);
	const isBlockTheme = scData?.is_block_theme;

	// Get the assigned template and template options for both block and classic themes
	const { template, templates, defaultTemplate, canCreate, canEdit } = useSelect(
		(select) => {
			const { canUser } = select(coreStore);

			if (isBlockTheme) {
				// Block theme logic - similar to original SelectTemplate
				const { type, slug, template: currentTemplate } = post || {};
				const { getEntityRecords } = select(coreStore);
				const selectorArgs = ['postType', 'wp_template', { per_page: -1 }];
				const templates = getEntityRecords(...selectorArgs) || [];
				const defaultTemplateId = select(coreStore).getDefaultTemplateId({
					slug: slug ? `single-${type}-${slug}` : `single-${type}`,
				});

				let currentTemplateRecord = null;

				// Find current template record
				if (currentTemplate) {
					const templateWithSameSlug = templates?.find(
						(template) => template.slug === currentTemplate
					);

					if (templateWithSameSlug?.id) {
						currentTemplateRecord = select(coreStore).getEditedEntityRecord(
							'postType',
							'wp_template',
							templateWithSameSlug.id
						);
					}
				}

				if (!currentTemplateRecord) {
					currentTemplateRecord = select(coreStore).getEditedEntityRecord(
						'postType',
						'wp_template',
						defaultTemplateId
					);
				}

				return {
					template: currentTemplateRecord,
					templates: templates.filter((template) => {
						const slug = template?.slug || '';
						return slug.includes('sc-products');
					}),
					defaultTemplate: select(coreStore).getEditedEntityRecord(
						'postType',
						'wp_template',
						defaultTemplateId
					),
					canCreate: canUser('create', 'templates'),
					canEdit: canUser('create', 'templates'),
				};
			} else {
				// Classic theme logic - similar to SelectTemplatePart
				const template = canUser('create', 'templates') &&
					select(coreStore).getEntityRecord(
						'postType',
						'wp_template_part',
						product?.metadata?.wp_template_part_id ||
							'surecart/surecart//product-info'
					);

				const { getEntityRecords } = select(coreStore);
				const selectorArgs = ['postType', 'wp_template_part', { per_page: -1 }];
				const templateParts = getEntityRecords(...selectorArgs) || [];

				return {
					template,
					templates: templateParts.filter((template) => {
						const slug = template?.slug || '';
						return slug.includes('product');
					}),
					defaultTemplate: null,
					canCreate: canUser('create', 'templates'),
					canEdit: canUser('create', 'templates'),
				};
			}
		},
		[isBlockTheme, post?.template, post?.slug, post?.type, product?.metadata?.wp_template_part_id]
	);

	// Prepare options for ScSelect
	const templateOptions = isBlockTheme 
		? [
			{
				value: '',
				label: defaultTemplate?.title?.rendered || 
					   defaultTemplate?.title || 
					   defaultTemplate?.slug || 
					   __('Default Template', 'surecart'),
			},
			...(templates ?? [])
				.map((template) => ({
					value: template?.slug,
					label: template?.title?.rendered || template?.title || template?.slug,
				}))
				.filter(
					(option, index, self) =>
						index === self.findIndex((t) => t.value === option.value)
				),
		  ]
		: (templates ?? [])
			.map((template) => ({
				value: template?.id,
				label: getTemplateTitle(template) || template?.slug,
			}))
			.filter(
				(option, index, self) =>
					index === self.findIndex((t) => t.value === option.value)
			);

	const handleTemplateChange = (value) => {
		if (isBlockTheme) {
			if (post?.id) {
				editEntityRecord(
					'postType',
					'sc_product',
					post.id,
					{ template: value },
					{ undoIgnore: true }
				);
			}
			
			// Update product metadata to prevent sync overwriting
			updateProduct({
				metadata: {
					...product.metadata,
					wp_template_id: value,
				},
			});
		} else {
			// Classic theme - update template part ID
			updateProduct({
				metadata: {
					...product.metadata,
					wp_template_part_id: value,
				},
			});
		}
	};

	const getCurrentTemplateValue = () => {
		if (isBlockTheme) {
			return template?.slug || '';
		} else {
			return product?.metadata?.wp_template_part_id || template?.id || '';
		}
	};

	const selectedTemplateLabel = isBlockTheme
		? (template?.title?.rendered || template?.title || template?.slug || __('Select template...', 'surecart'))
		: (getTemplateTitle(template) || __('Select template...', 'surecart'));

	return (
		<Box
			loading={loading}
			title={__('Template', 'surecart')}
			header_action={
				canCreate && (
					<ScButton
						type="text"
						size="small"
						onClick={() => setIsCreateModalOpen(true)}
						css={css`
							font-size: 13px;
							color: var(--sc-color-primary-500);
							text-decoration: none;
							&:hover {
								color: var(--sc-color-primary-600);
								text-decoration: underline;
							}
						`}
					>
						<ScIcon name="plus" style={{ marginRight: '4px' }} />
						{__('Add template', 'surecart')}
					</ScButton>
				)
			}
			footer={
				canEdit && template && (
					<ScButton
						type="link"
						href={addQueryArgs('site-editor.php', isBlockTheme ? {
							postType: 'wp_template',
							postId: template?.id || 'surecart/surecart//single-sc_product',
							canvas: 'edit',
						} : {
							postType: 'wp_template_part',
							postId: template?.id || 'surecart/surecart//product-info',
							canvas: 'edit',
						})}
						css={css`
							padding: 12px 16px;
							font-size: 13px;
							display: flex;
							align-items: center;
							color: var(--sc-color-gray-700);
							text-decoration: none;
							&:hover {
								color: var(--sc-color-gray-900);
								text-decoration: none;
							}
						`}
					>
						<ScIcon 
							name="edit" 
							style={{ 
								marginRight: '8px', 
								width: '16px', 
								height: '16px' 
							}} 
						/>
						{__('Edit Template', 'surecart')}
					</ScButton>
				)
			}
		>
			<div
				css={css`
					display: grid;
					gap: 16px;
				`}
			>
				<div>
					<label
						css={css`
							display: block;
							font-weight: 500;
							margin-bottom: 8px;
							font-size: 13px;
							color: var(--sc-input-label-color);
						`}
					>
						{__('Page Layout', 'surecart')}
					</label>
					<ScSelect
						placeholder={__('Select...', 'surecart')}
						value=""
						css={css`
							width: 100%;
						`}
					>
						<sc-option value="">{__('Select...', 'surecart')}</sc-option>
					</ScSelect>
				</div>

				<div>
					<label
						css={css`
							display: block;
							font-weight: 500;
							margin-bottom: 8px;
							font-size: 13px;
							color: var(--sc-input-label-color);
						`}
					>
						{__('Template', 'surecart')}
					</label>
					<ScSelect
						value={getCurrentTemplateValue()}
						onScChange={(e) => handleTemplateChange(e.target.value)}
						css={css`
							width: 100%;
						`}
					>
						{templateOptions.map((option) => (
							<sc-option key={option.value} value={option.value}>
								{option.label}
							</sc-option>
						))}
					</ScSelect>
				</div>
			</div>

			{isCreateModalOpen && isBlockTheme && (
				<PostTemplateCreateModal
					template={defaultTemplate}
					product={product}
					post={post}
					updateProduct={updateProduct}
					onClose={() => setIsCreateModalOpen(false)}
				/>
			)}
			
			{isCreateModalOpen && !isBlockTheme && (
				<PostTemplatePartCreateModal
					template={template}
					product={product}
					updateProduct={updateProduct}
					onClose={() => setIsCreateModalOpen(false)}
				/>
			)}
		</Box>
	);
};