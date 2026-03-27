/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScButton,
	ScFormControl,
	ScIcon,
	ScSelect,
	ScMenuItem,
	ScDivider,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { getTemplateTitle } from '../../../util/templates';
import PostTemplateCreateModal from './create-modal';
import { useState } from '@wordpress/element';

export default ({ upsell, onUpdate }) => {
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

	const template = useSelect(
		(select) => {
			return (
				select(coreStore).canUser('create', 'templates') &&
				select(coreStore).getEntityRecord(
					'postType',
					'wp_template',
					upsell?.metadata?.wp_template_id ||
						'surecart/surecart//single-upsell'
				)
			);
		},
		[upsell?.metadata?.wp_template_id]
	);

	// templates.
	const { templates, defaultPart, canCreate } = useSelect(
		(select) => {
			const { canUser, getEntityRecords } = select(coreStore);
			const selectorArgs = ['postType', 'wp_template', { per_page: -1 }];
			const templates = (getEntityRecords(...selectorArgs) || []).filter(
				(template) => {
					return (
						template.id === 'surecart/surecart//single-upsell' ||
						template.slug.includes('sc-upsell-funnels')
					);
				}
			);
			return {
				templates,
				defaultPart: templates.find(
					(part) => part.theme === 'surecart/surecart'
				),
				canCreate: canUser('create', 'templates'),
			};
		},
		[template]
	);

	return (
		<>
			<ScFormControl label={__('Template', 'surecart')}>
				<div
					css={css`
						display: flex;
						gap: 1em;
					`}
				>
					<ScSelect
						css={css`
							flex: 1;
						`}
						value={upsell?.metadata?.wp_template_id || ''}
						choices={(templates ?? []).map((template) => {
							return {
								value: template?.id,
								label: getTemplateTitle(template),
							};
						})}
						onScChange={(e) => {
							onUpdate({
								metadata: {
									...upsell?.metadata,
									wp_template_id: e.target.value,
								},
							});
						}}
						required
						unselect={false}
					>
						<span slot="prefix">
							<ScMenuItem
								onClick={() => setIsCreateModalOpen(true)}
							>
								<span slot="prefix">+</span>
								{__('Add New', 'surecart')}
							</ScMenuItem>
							<ScDivider
								style={{
									'--spacing': 'var(--sc-spacing-x-small)',
								}}
							></ScDivider>
						</span>
					</ScSelect>

					<ScButton
						href={addQueryArgs('site-editor.php', {
							postType: 'wp_template',
							postId:
								upsell?.metadata?.wp_template_id ||
								'surecart/surecart//single-upsell',
							canvas: 'edit',
						})}
						target="_blank"
					>
						{__('Edit', 'surecart')}
						<ScIcon name="external-link" slot="suffix" />
					</ScButton>
				</div>
			</ScFormControl>

			{isCreateModalOpen && (
				<PostTemplateCreateModal
					template={defaultPart}
					upsell={upsell}
					updateUpsell={onUpdate}
					onClose={() => setIsCreateModalOpen(false)}
				/>
			)}
		</>
	);
};
