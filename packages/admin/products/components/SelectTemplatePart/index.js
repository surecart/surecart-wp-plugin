/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState } from '@wordpress/element';

import { getTemplateTitle } from '../../utility';
import { ScSelect } from '@surecart/components-react';
import PostTemplateCreateModal from './create-modal';

export default function SelectTemplatePart({
	product,
	updateProduct,
	post,
	modal,
	setModal,
}) {
	const [templatePartCreated, setTemplatePartCreated] = useState(null);
	const { parts, defaultPart, canCreate } = useSelect(
		(select) => {
			const { canUser, getEntityRecords } = select(coreStore);
			const parts = (
				getEntityRecords('postType', 'wp_template_part', {
					per_page: -1,
				}) || []
			).filter((t) => {
				return (
					t.slug.includes('product-info') ||
					t.slug.includes('sc-part-products-info')
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

	// Get current template part.
	const template = useSelect(
		(select) => {
			return (
				select(coreStore).canUser('create', 'templates') &&
				select(coreStore).getEntityRecord(
					'postType',
					'wp_template_part',
					product?.metadata?.wp_template_part_id ||
						'surecart/surecart//product-info'
				)
			);
		},
		[product?.metadata?.wp_template_part_id]
	);

	const options = (parts ?? []).map((part) => {
		return {
			value: part?.id,
			label: getTemplateTitle(part),
		};
	});

	const defaultPageLayout = Object.keys(
		scData?.availableTemplates || {}
	).find((value, label) => !value);

	console.log('templatePartCreated', templatePartCreated);

	return (
		<div>
			<div style={{ marginBottom: '16px' }}>
				<ScSelect
					label={__('Page Layout', 'surecart')}
					value={product?.metadata?.wp_template_id || ''}
					choices={Object.keys(scData?.availableTemplates || {}).map(
						(value) => ({
							value,
							label: scData?.availableTemplates[value],
						})
					)}
					placeholder={
						scData?.availableTemplates?.[defaultPageLayout] ||
						__('Select a layout', 'surecart')
					}
					onScChange={(e) =>
						updateProduct({
							metadata: {
								...product.metadata,
								wp_template_id: e.target.value,
							},
						})
					}
				/>
			</div>

			<ScSelect
				label={__('Template', 'surecart')}
				value={
					templatePartCreated?.slug ||
					product?.metadata?.wp_template_part_id ||
					template?.id ||
					''
				}
				choices={[
					!!templatePartCreated?.id && {
						value: templatePartCreated.slug,
						label:
							templatePartCreated.title?.rendered ||
							templatePartCreated.title ||
							__('(no title)'),
					},
					...options,
				]}
				onScChange={(e) =>
					updateProduct({
						metadata: {
							...product.metadata,
							wp_template_part_id: e.target.value,
						},
					})
				}
			/>

			{!!modal && !!canCreate && (
				<PostTemplateCreateModal
					template={defaultPart}
					product={product}
					updateProduct={updateProduct}
					onClose={() => setModal(false)}
					setTemplatePart={(templatePart) =>
						setTemplatePartCreated(templatePart)
					}
				/>
			)}
		</div>
	);
}
