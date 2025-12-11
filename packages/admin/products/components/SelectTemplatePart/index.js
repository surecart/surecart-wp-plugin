/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import { getTemplateTitle } from '../../utility';
import { ScSelect } from '@surecart/components-react';
import PostTemplateCreateModal from './create-modal';

export default function SelectTemplatePart({
	product,
	updateProduct,
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

	const pageLayouts = Object.keys(scData?.availableTemplates || {})
		.map((value) => ({
			value,
			label: scData?.availableTemplates?.[value],
		}))
		.sort((a, b) => {
			// show empty layouts first.
			if (!a.value) return -1;
			if (!b.value) return 1;
			return true;
		});

	const defaultPageLayout = Object.keys(
		scData?.availableTemplates || {}
	).find((value, label) => !value);

	return (
		<div>
			<div style={{ marginBottom: '16px' }}>
				<ScSelect
					label={__('Page Layout', 'surecart')}
					value={product?.metadata?.wp_template_id || ''}
					choices={pageLayouts}
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
					style={{
						'--sc-input-placeholder-color': 'var(--sc-input-color)',
					}}
				/>
			</div>

			<ScSelect
				label={__('Product Template', 'surecart')}
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
				].filter(Boolean)}
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
