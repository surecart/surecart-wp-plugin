/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useInnerBlocksProps as __stableUseInnerBlocksProps,
	__experimentalUseInnerBlocksProps,
} from '@wordpress/block-editor';

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
				['surecart/invoice-memo', {}],
			],
			templateLock: false,
		}
	);

	return <sc-invoice-details {...innerBlocksProps}></sc-invoice-details>;
};
