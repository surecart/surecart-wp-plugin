/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	__experimentalUseColorProps as useColorProps,
} from '@wordpress/block-editor';
import { RichText } from '@wordpress/block-editor';

export default ({ attributes, setAttributes, __unstableLayoutClassNames }) => {
	const { label } = attributes;
	const blockProps = useBlockProps({
		className: __unstableLayoutClassNames,
	});
	const colorProps = useColorProps(attributes);

	const TEMPLATE = [['surecart/product-price-choice-template']];
	const innerBlocksProps = useInnerBlocksProps(
		{},
		{
			template: TEMPLATE,
		}
	);

	return (
		<div {...blockProps}>
			<RichText
				tagName="label"
				className={classnames('sc-form-label', colorProps.className)}
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
