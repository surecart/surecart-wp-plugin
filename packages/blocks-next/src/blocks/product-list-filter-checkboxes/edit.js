import { __ } from '@wordpress/i18n';
import TemplateListEdit from '../../components/TemplateListEdit';
import {
	InspectorControls,
	store as blockEditorStore,
	InnerBlocks,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { useEntityRecords } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

const TEMPLATE = [['surecart/product-list-filter-checkbox']];

export default ({
	clientId,
	__unstableLayoutClassNames,
	attributes: { taxonomy: taxonomySlug },
	setAttributes,
}) => {
	const blockCount = useSelect((select) =>
		select(blockEditorStore).getBlockCount(clientId)
	);
	const { records: allTaxonomies } = useEntityRecords('root', 'taxonomy', {
		per_page: -1,
	});

	// get all visible taxonomies for this post type.
	const taxonomies = (allTaxonomies ?? []).filter(
		(taxonomy) =>
			taxonomy.types.includes('sc_product') && taxonomy?.visibility.public
	);

	const blockProps = useBlockProps({
		className: __unstableLayoutClassNames,
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings')}>
					{Array.isArray(taxonomies) && (
						<SelectControl
							__nextHasNoMarginBottom
							__next40pxDefaultSize
							label={__('Taxonomy')}
							options={taxonomies.map((t) => ({
								label: t.name,
								value: t.slug,
							}))}
							value={taxonomySlug}
							onChange={(selectedTaxonomy) =>
								setAttributes({
									taxonomy: selectedTaxonomy,
									label:
										taxonomies.find(
											(t) => t.slug === selectedTaxonomy
										)?.name ?? __('Filter', 'surecart'),
								})
							}
						/>
					)}
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<TemplateListEdit
					template={TEMPLATE}
					blockContexts={[
						{
							id: 'filter-1',
							'surecart/checkbox/name': __('Filter 1'),
						},
						{
							id: 'filter-2',
							'surecart/checkbox/name': __('Filter 2'),
						},
						{
							id: 'filter-3',
							'surecart/checkbox/name': __('Filter 3'),
						},
					]}
					className={__unstableLayoutClassNames}
					clientId={clientId}
					renderAppender={
						blockCount ? undefined : InnerBlocks.ButtonBlockAppender
					}
				/>
			</div>
		</>
	);
};
