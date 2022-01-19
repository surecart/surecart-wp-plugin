/**
 * WordPress dependencies
 */
import { useInnerBlocksProps, useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { isStackedOnMobile, verticalAlignment } = attributes;

	const blockProps = useBlockProps.save();
	const innerBlocksProps = useInnerBlocksProps.save(blockProps);

	return (
		<ce-columns
			vertical-alignment={verticalAlignment}
			is-stacked-on-mobile={isStackedOnMobile}
			{...innerBlocksProps}
		/>
	);
}
