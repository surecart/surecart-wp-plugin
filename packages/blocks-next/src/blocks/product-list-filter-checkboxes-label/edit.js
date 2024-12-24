import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { useEntityRecords } from '@wordpress/core-data';
import { useEffect } from '@wordpress/element';

export default ({
	setAttributes,
	context: {
		'surecart/product-list-filter-checkboxes/taxonomy': taxonomySlug,
	},
	attributes: { label },
}) => {
	const { records: allTaxonomies } = useEntityRecords('root', 'taxonomy', {
		per_page: -1,
	});

	// get all visible taxonomies for this post type.
	const taxonomies = (allTaxonomies ?? []).filter(
		(taxonomy) =>
			taxonomy.types.includes('sc_product') && taxonomy?.visibility.public
	);

	useEffect(() => {
		if (!taxonomySlug) return;

		const newLabel =
			taxonomies.find((t) => t.slug === taxonomySlug)?.name ??
			__('Filter by', 'surecart');

		setAttributes({ label: newLabel });
	}, [taxonomySlug]);

	const blockProps = useBlockProps();
	return (
		<div {...blockProps}>
			<RichText
				tagName="span"
				aria-label={__('Label text', 'surecart')}
				placeholder={__('Add label…', 'surecart')}
				value={label}
				onChange={(label) => setAttributes({ label })}
				withoutInteractiveFormatting
				allowedFormats={[]}
			/>
		</div>
	);
};
