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
					'wp_template_part',
					upsell?.metadata?.template_part_id ||
						'surecart/surecart//upsell-info'
				)
			);
		},
		[upsell?.metadata?.template_part_id]
	);

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
						value={template?.id || 'surecart/surecart//upsell-info'}
						choices={(parts ?? []).map((part) => {
							return {
								value: part?.id,
								label: getTemplateTitle(part),
							};
						})}
						onScChange={(e) => {
							onUpdate({
								metadata: {
									...upsell?.metadata,
									template_part_id: e.target.value,
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
							postType: 'wp_template_part',
							postId:
								upsell?.metadata?.template_part_id ||
								'surecart/surecart//upsell-info',
							canvas: 'edit',
						})}
						target="_blank"
					>
						{__('Edit', 'surecart')}
						<ScIcon name="external-link" slot="suffix" />
					</ScButton>
				</div>
			</ScFormControl>

			<ScSelect
				label={__('Page Layout', 'surecart')}
				placeholder={__('Theme Layout', 'surecart')}
				value={upsell?.metadata?.wp_template_id || ''}
				choices={Object.keys(scData?.availableTemplates || {}).map(
					(value) => {
						const label = scData?.availableTemplates[value];
						return {
							value,
							label,
						};
					}
				)}
				onScChange={(e) => {
					onUpdate({
						metadata: {
							...upsell?.metadata,
							wp_template_id: e.target.value,
						},
					});
				}}
			/>

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
