import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { RichText } from '@wordpress/block-editor';
import { useEntityRecord } from '@wordpress/core-data';

export default ({
	attributes,
	setAttributes,
	context: { 'surecart/productId': productId },
}) => {
	const { text } = attributes;

	const { record } = useEntityRecord('postType', 'sc_product', productId);
	const product = record?.meta?.product;

	const blockProps = useBlockProps({
		className: 'sc-tag sc-tag--primary',
	});

	// we have a product and it is not on sale.
	if (product && !product?.is_on_sale) {
		return null;
	}

	return (
		<RichText
			tagName="div"
			value={text}
			onChange={(text) => setAttributes({ text })}
			aria-label={text ? __('Sale Label') : __('Empty Sale label')}
			data-empty={text ? false : true}
			placeholder={__('Type in sale badge text', 'surecart')}
			allowedFormats={['core/bold', 'core/italic']}
			{...blockProps}
		/>
	);
};
