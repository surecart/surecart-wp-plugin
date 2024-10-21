/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useInnerBlocksProps as __stableUseInnerBlocksProps,
	__experimentalUseInnerBlocksProps,
} from '@wordpress/block-editor';

const ALLOWED_BLOCKS = ['surecart/invoice-memo'];

export default () => {
	const useInnerBlocksProps = __stableUseInnerBlocksProps
		? __stableUseInnerBlocksProps
		: __experimentalUseInnerBlocksProps;

	const innerBlocksProps = useInnerBlocksProps(
		{},
		{
			template: [['surecart/invoice-memo', {}]],
			allowedBlocks: ALLOWED_BLOCKS,
			templateLock: false,
		}
	);

	return <sc-invoice-additional {...innerBlocksProps}></sc-invoice-additional>;
};
