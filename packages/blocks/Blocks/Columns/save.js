/**
 * WordPress dependencies
 */
import {
	useInnerBlocksProps as __stableUseInnerBlocksProps,
	__experimentalUseInnerBlocksProps,
	useBlockProps,
} from '@wordpress/block-editor';

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
			is-stacked-on-mobile={isStackedOnMobile ? 'true' : 'false'}
			is-full-height={isFullHeight ? 'true' : 'false'}
			is-reversed-on-mobile={isReversedOnMobile ? 'true' : 'false'}
			{...innerBlocksPropsObj}
		/>
	);
}
