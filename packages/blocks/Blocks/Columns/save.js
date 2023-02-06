/**
 * WordPress dependencies
 */
import { __experimentalUseInnerBlocksProps, useInnerBlocksProps as __stableUseInnerBlocksProps, useBlockProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { getPresetStyles } from './utils';

export default function save({ attributes }) {
	const useInnerBlocksProps = __stableUseInnerBlocksProps
		? __stableUseInnerBlocksProps
		: __experimentalUseInnerBlocksProps;

	const {
		isStackedOnMobile,
		verticalAlignment,
		isFullHeight,
		isReversedOnMobile,
		style,
	} = attributes;

	const blockProps = useBlockProps.save();
	const innerBlocksProps = useInnerBlocksProps.save(blockProps);

	const presetStyles = getPresetStyles(style);

	const innerBlocksPropsObj = {
		...innerBlocksProps,
		style: { ...innerBlocksProps?.style, ...presetStyles },
	};

	return (
		<sc-columns
			vertical-alignment={verticalAlignment}
			is-stacked-on-mobile={isStackedOnMobile ? '1': null}
			is-full-height={isFullHeight ? '1' : null}
			is-reversed-on-mobile={isReversedOnMobile ? '1': null}
			{...innerBlocksPropsObj}
		/>
	);
}
