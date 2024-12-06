import { __ } from '@wordpress/i18n';
import TemplateListEdit from '../../components/TemplateListEdit';
import {
	InspectorControls,
	store as blockEditorStore,
	InnerBlocks,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { useEntityRecords } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

const TEMPLATE = [['surecart/product-list-sort-radio']];

export default ({
	clientId,
	__unstableLayoutClassNames,
	attributes: { taxonomy: taxonomySlug, label },
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
		<div {...blockProps}>
			<RichText
				tagName="span"
				aria-label={__('Label text', 'surecart')}
				placeholder={__('Add label…', 'surecart')}
				value={label}
				onChange={(label) => setAttributes({ label })}
				withoutInteractiveFormatting
				allowedFormats={['core/bold', 'core/italic']}
			/>
			<TemplateListEdit
				template={TEMPLATE}
				blockContexts={[
					{
						id: 'date:desc',
						'surecart/radio/name': __('Latest'),
					},
					{
						id: 'date:asc',
						'surecart/radio/name': __('Oldest'),
					},
					{
						id: 'price:desc',
						'surecart/radio/name': __('Price, low to high'),
					},
					{
						id: 'price:asc',
						'surecart/radio/name': __('Price, high to low'),
					},
				]}
				className={__unstableLayoutClassNames}
				clientId={clientId}
				renderAppender={false}
			/>
		</div>
	);
};
