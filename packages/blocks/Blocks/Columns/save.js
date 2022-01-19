/**
 * WordPress dependencies
 */
import {
	useInnerBlocksProps as __stableUseInnerBlocksProps,
	__experimentalUseInnerBlocksProps,
	useBlockProps,
} from '@wordpress/block-editor';

export default function save({ attributes }) {
	const useInnerBlocksProps = __stableUseInnerBlocksProps
		? __stableUseInnerBlocksProps
		: __experimentalUseInnerBlocksProps;

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
