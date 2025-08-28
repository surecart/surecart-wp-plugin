/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';

import Box from '../../ui/Box';
import { ScButton, ScIcon } from '@surecart/components-react';
import SelectTemplate from '../components/SelectTemplate';
import SelectTemplatePart from '../components/SelectTemplatePart';

export default ({ product, updateProduct, post, loading }) => {
	const [modal, setModal] = useState(false);
	const isBlockTheme = scData?.is_block_theme;

	// Get the assigned template and template options for both block and classic themes
	const { template, canCreate, canEdit } = useSelect(
		(select) => {
			const { canUser } = select(coreStore);

			if (isBlockTheme) {
				// Block theme logic - similar to original SelectTemplate
				const { type, slug, template: currentTemplate } = post || {};
				const { getEntityRecords } = select(coreStore);
				const selectorArgs = [
					'postType',
					'wp_template',
					{ per_page: -1 },
				];
				const templates = getEntityRecords(...selectorArgs) || [];
				const defaultTemplateId = select(
					coreStore
				).getDefaultTemplateId({
					slug: slug ? `single-${type}-${slug}` : `single-${type}`,
				});

				let currentTemplateRecord = null;

				// Find current template record
				if (currentTemplate) {
					const templateWithSameSlug = templates?.find(
						(template) => template.slug === currentTemplate
					);

					if (templateWithSameSlug?.id) {
						currentTemplateRecord = select(
							coreStore
						).getEditedEntityRecord(
							'postType',
							'wp_template',
							templateWithSameSlug.id
						);
					}
				}

				if (!currentTemplateRecord) {
					currentTemplateRecord = select(
						coreStore
					).getEditedEntityRecord(
						'postType',
						'wp_template',
						defaultTemplateId
					);
				}

				return {
					template: currentTemplateRecord,
					canCreate: canUser('create', 'templates'),
					canEdit: canUser('create', 'templates'),
				};
			} else {
				const template =
					canUser('create', 'templates') &&
					select(coreStore).getEntityRecord(
						'postType',
						'wp_template_part',
						product?.metadata?.wp_template_part_id ||
							'surecart/surecart//product-info'
					);

				return {
					template,
					defaultTemplate: null,
					canCreate: canUser('create', 'templates'),
					canEdit: canUser('create', 'templates'),
				};
			}
		},
		[
			isBlockTheme,
			post?.template,
			post?.slug,
			post?.type,
			product?.metadata?.wp_template_part_id,
		]
	);

	const editUrl = isBlockTheme
		? addQueryArgs('site-editor.php', {
				postType: 'wp_template',
				postId: template?.id || 'surecart/surecart//single-sc_product',
				canvas: 'edit',
		  })
		: addQueryArgs('site-editor.php', {
				postType: 'wp_template_part',
				postId: template?.id || 'surecart/surecart//product-info',
				canvas: 'edit',
		  });

	return (
		<Box
			loading={loading}
			title={
				<div
					css={css`
						display: flex;
						align-items: center;
						justify-content: space-between;
						flex-grow: 1;
					`}
				>
					{__('Template', 'surecart')}
				</div>
			}
			header_action={
				canCreate && (
					<div
						css={css`
							margin: -12px var(--sc-spacing-xxxx-large);
						`}
					>
						<ScButton
							type="link"
							onClick={() => setModal(true)}
							disabled={loading}
						>
							<ScIcon name="plus" slot="prefix" />
							{__('Add template', 'surecart')}
						</ScButton>
					</div>
				)
			}
			footer={
				canEdit &&
				template && (
					<ScButton type="default" href={editUrl}>
						<ScIcon name="edit" slot="prefix" />
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
				{isBlockTheme ? (
					<SelectTemplate
						post={post}
						product={product}
						updateProduct={updateProduct}
						template={template}
						modal={modal}
						setModal={setModal}
					/>
				) : (
					<SelectTemplatePart
						post={post}
						product={product}
						updateProduct={updateProduct}
						modal={modal}
						setModal={setModal}
					/>
				)}
			</div>
		</Box>
	);
};
