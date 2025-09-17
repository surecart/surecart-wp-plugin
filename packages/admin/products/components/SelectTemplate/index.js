/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import { ScSelect } from '@surecart/components-react';
import PostTemplateCreateModal from './create-modal';

export default function SelectTemplate({
	product,
	updateProduct,
	post,
	template,
	modal,
	setModal,
}) {
	const { editEntityRecord } = useDispatch(coreStore);
	const [templateCreated, setTemplateCreated] = useState(null);
	const { templates, defaultTemplate, canCreate } = useSelect(
		(select) => {
			const { canUser, getEntityRecords } = select(coreStore);
			const selectorArgs = ['postType', 'wp_template', { per_page: -1 }];
			const templates = getEntityRecords(...selectorArgs) || [];
			const { type, slug } = post;
			const defaultTemplateId = select(coreStore).getDefaultTemplateId({
				slug: post?.slug ? `single-${type}-${slug}` : `single-${type}`,
			});
			return {
				templates: templates.filter((t) => {
					const slug = t?.slug || '';
					return slug.includes('sc-products');
				}),
				defaultTemplate: select(coreStore).getEditedEntityRecord(
					'postType',
					'wp_template',
					defaultTemplateId
				),
				canCreate: canUser('create', 'templates'),
			};
		},
		[post?.slug, post?.type, product?.metadata?.wp_template_id]
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

	return (
		<div>
			<ScSelect
				label={__('Template')}
				value={templateCreated?.slug || template?.slug}
				choices={[
					!!templateCreated?.id && {
						value: templateCreated.slug,
						label:
							templateCreated.title?.rendered ||
							templateCreated.title ||
							__('(no title)'),
					},
					...options,
				]}
				placeholder={
					defaultTemplate?.title?.rendered ||
					defaultTemplate?.title ||
					__('Select a template')
				}
				onScChange={(e) => {
					editEntityRecord(
						'postType',
						'sc_product',
						post?.id,
						{ template: e.target.value },
						{ undoIgnore: true }
					);
					// needed to make sure sync does not overwrite the template
					updateProduct({
						metadata: {
							...product.metadata,
							wp_template_id: e.target.value,
						},
					});
				}}
			/>

			{!!modal && canCreate && (
				<PostTemplateCreateModal
					template={defaultTemplate}
					product={product}
					post={post}
					updateProduct={updateProduct}
					onClose={() => setModal(false)}
					setTemplate={(template) => setTemplateCreated(template)}
				/>
			)}
		</div>
	);
}
