import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps as __stableUseInnerBlocksProps,
	__experimentalUseInnerBlocksProps,
} from '@wordpress/block-editor';

export default () => {
	const useInnerBlocksProps = __stableUseInnerBlocksProps
		? __stableUseInnerBlocksProps
		: __experimentalUseInnerBlocksProps;

	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'sc-invoice-details',
		},
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

	return (
		<div {...blockProps}>
			<style>{`
				.sc-invoice-details > * {
					margin: 4px 0 !important;
				}
				.sc-invoice-details > sc-divider {
					margin: 16px 0 !important;
				}
			`}</style>
			<div {...innerBlocksProps}></div>
		</div>
	);
};
