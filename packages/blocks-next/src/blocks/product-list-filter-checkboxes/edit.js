import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useInnerBlocksProps,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { useEntityRecords } from '@wordpress/core-data';

const TEMPLATE = [
	['surecart/product-list-filter-checkboxes-label'],
	['surecart/product-list-filter-checkboxes-template'],
];

export default ({ attributes: { taxonomy: taxonomySlug }, setAttributes }) => {
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
	});

	const { records: allTaxonomies } = useEntityRecords('root', 'taxonomy', {
		per_page: -1,
	});

	// get all visible taxonomies for this post type.
	const taxonomies = (allTaxonomies ?? []).filter(
		(taxonomy) =>
			taxonomy.types.includes('sc_product') && taxonomy?.visibility.public
	);

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

			<div {...innerBlocksProps} />
		</>
	);
};
