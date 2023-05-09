/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function save({ attributes, className }) {
	const { fontSize, style, contentJustification, orientation } = attributes;
	const blockProps = useBlockProps.save({
		className: classnames(className, {
			'wp-block-buttons': true,
			'has-custom-font-size': fontSize || style?.typography?.fontSize,
			[`is-content-justification-${contentJustification}`]:
				contentJustification,
			'is-vertical': orientation === 'vertical',
		}),
	});

	const innerBlocksProps = useInnerBlocksProps.save(blockProps);
	return <sc-product-form {...innerBlocksProps} />;
}
