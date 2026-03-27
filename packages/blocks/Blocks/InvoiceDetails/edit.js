/** @jsx jsx */
import { css, jsx } from '@emotion/react';

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
		{
			className: 'sc-invoice-details',
			css: css`
				> * {
					margin: 4px 0 !important;
				}
				> sc-divider {
					margin: 16px 0 !important;
				}
			`,
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

	return <div {...innerBlocksProps}></div>;
};
