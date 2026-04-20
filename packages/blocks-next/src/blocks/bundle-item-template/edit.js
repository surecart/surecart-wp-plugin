/**
 * WordPress dependencies
 */
import {
	useBlockProps,
	useInnerBlocksProps as __stableUseInnerBlocksProps,
	__experimentalUseInnerBlocksProps,
} from '@wordpress/block-editor';

const TEMPLATE = [
	['surecart/bundle-item-image', {}, []],
	[
		'core/group',
		{
			style: { spacing: { blockGap: '2px' } },
			layout: { type: 'flex', orientation: 'vertical' },
		},
		[
			['surecart/bundle-item-name', {}, []],
			['surecart/bundle-item-variant', {}, []],
		],
	],
	['surecart/bundle-item-price', {}, []],
	['surecart/bundle-item-quantity', {}, []],
];

export default ({ __unstableLayoutClassNames }) => {
	const blockProps = useBlockProps({
		className: `sc-bundle-item ${__unstableLayoutClassNames || ''}`,
	});

	const useInnerBlocksProps = __stableUseInnerBlocksProps
		? __stableUseInnerBlocksProps
		: __experimentalUseInnerBlocksProps;

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
		templateLock: false,
		renderAppender: false,
	});

	return <div {...innerBlocksProps} />;
};
