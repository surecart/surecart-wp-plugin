import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { useEntityRecords } from '@wordpress/core-data';

export default ({ attributes: { taxonomy: taxonomySlug }, setAttributes }) => {
	const blockProps = useBlockProps({
		className: 'sc-dropdown',
	});
	const { records: allTaxonomies } = useEntityRecords('root', 'taxonomy');

	// get all visible taxonomies for this post type.
	const taxonomies = (allTaxonomies ?? []).filter(
		(taxonomy) =>
			taxonomy.types.includes('sc_product') && taxonomy?.visibility.public
	);

	return (
		<div {...blockProps} role="menu" tabIndex="-1">
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
								})
							}
						/>
					)}
				</PanelBody>
			</InspectorControls>
			<button className="sc-dropdown__trigger sc-button sc-button--standard sc-button--medium sc-button--caret sc-button--has-label sc-button--text">
				<span className="sc-button__label">
					{__('Filter', 'surecart')}
				</span>
				<span className="sc-button__caret">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<polyline points="6 9 12 15 18 9" />
					</svg>
				</span>
			</button>
		</div>
	);
};
