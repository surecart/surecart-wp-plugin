/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useInnerBlocksProps as __stableUseInnerBlocksProps,
	__experimentalUseInnerBlocksProps,
} from '@wordpress/block-editor';

const ALLOWED_BLOCKS = [
	'surecart/invoice-number',
	'surecart/invoice-due-date',
	'surecart/invoice-receipt-download',
];

export default () => {
	const useInnerBlocksProps = __stableUseInnerBlocksProps
		? __stableUseInnerBlocksProps
		: __experimentalUseInnerBlocksProps;

	const innerBlocksProps = useInnerBlocksProps(
		{},
		{
			template: [
				['surecart/invoice-number', {}],
				['surecart/invoice-due-date', {}],
				['surecart/invoice-receipt-download', {}],
			],
			allowedBlocks: ALLOWED_BLOCKS,
			templateLock: false,
		}
	);

	return <sc-invoice-details {...innerBlocksProps}></sc-invoice-details>;
};
