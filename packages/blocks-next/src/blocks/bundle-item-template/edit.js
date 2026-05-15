/**
 * WordPress dependencies.
 */
import {
	useBlockProps,
	useInnerBlocksProps as __stableUseInnerBlocksProps,
	__experimentalUseInnerBlocksProps,
} from '@wordpress/block-editor';

const TEMPLATE = [
	[
		'core/group',
		{
			style: { spacing: { blockGap: '4px' } },
			layout: {
				type: 'flex',
				orientation: 'horizontal',
				justifyContent: 'left',
				flexWrap: 'nowrap',
			},
		},
		[
			['surecart/bundle-product-name', {}, []],
			['surecart/bundle-variant-name', {}, []],
			['surecart/bundle-item-quantity', {}, []],
		],
	],
	[
		'surecart/bundle-item-variant',
		{},
		[['surecart/bundle-item-variant-pill']],
	],
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
