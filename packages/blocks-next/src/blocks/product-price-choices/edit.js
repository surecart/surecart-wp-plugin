import { __ } from '@wordpress/i18n';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import { RichText } from '@wordpress/block-editor';

export default ({ attributes, setAttributes }) => {
	const { label } = attributes;
	const blockProps = useBlockProps();

	const TEMPLATE = [['surecart/product-price-choice-template']];
	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
	});

	return (
		<div {...blockProps}>
			<RichText
				tagName="label"
				className="sc-form-label"
				aria-label={__('Label text', 'surecart')}
				placeholder={__('Add label…', 'surecart')}
				value={label}
				onChange={(label) => setAttributes({ label })}
				withoutInteractiveFormatting
				allowedFormats={['core/bold', 'core/italic']}
			/>
			<div className="sc-choices">
				<div {...innerBlocksProps} />
			</div>
		</div>
	);
};
