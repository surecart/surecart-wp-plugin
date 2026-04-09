/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InnerBlocks,
	useInnerBlocksProps as __stableUseInnerBlocksProps,
	__experimentalUseInnerBlocksProps,
} from '@wordpress/block-editor';

export default () => {
	const useInnerBlocksProps = __stableUseInnerBlocksProps
		? __stableUseInnerBlocksProps
		: __experimentalUseInnerBlocksProps;

	const blockProps = useBlockProps({
		className: 'sc-customer-dashboard-area-editor',
	});

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		templateLock: false,
		renderAppender: InnerBlocks.ButtonBlockAppender,
	});

	return (
		<>
			<style>{`
				.sc-customer-dashboard-area-editor > * {
					margin-bottom: var(--sc-spacing-xx-large) !important;
					font-size: 15px;
				}
				.sc-customer-dashboard-area-editor .block-list-appender {
					position: relative;
				}
			`}</style>
			<div {...innerBlocksProps}></div>
		</>
	);
};
