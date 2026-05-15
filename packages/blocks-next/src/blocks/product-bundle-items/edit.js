/**
 * WordPress dependencies
 */
import {
	useBlockProps,
	useInnerBlocksProps as __stableUseInnerBlocksProps,
	__experimentalUseInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { useEffect } from '@wordpress/element';

const TEMPLATE = [
	[
		'surecart/bundle-item-template',
		{
			layout: {
				type: 'flex',
				orientation: 'vertical',
			},
		},
	],
];

// Every child in the bundle subtree has `inserter: false`, so the vanilla
// `template` prop of useInnerBlocksProps doesn't auto-create them on first
// mount in the site editor. We force the initial tree via replaceInnerBlocks.
const buildDefaultTree = () =>
	createBlock(
		'surecart/bundle-item-template',
		{
			layout: {
				type: 'flex',
				orientation: 'vertical',
			},
		},
		[
			createBlock(
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
					createBlock('surecart/bundle-product-name'),
					createBlock('surecart/bundle-variant-name'),
					createBlock('surecart/bundle-item-quantity'),
				]
			),
			createBlock('surecart/bundle-item-variant', {}, [
				createBlock('surecart/bundle-item-variant-pill'),
			]),
		]
	);

export default ({ clientId }) => {
	const blockProps = useBlockProps({
		className: 'sc-bundle-items',
	});

	const useInnerBlocksProps = __stableUseInnerBlocksProps
		? __stableUseInnerBlocksProps
		: __experimentalUseInnerBlocksProps;

	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'sc-bundle-items__list' },
		{
			template: TEMPLATE,
			templateLock: false,
			allowedBlocks: ['surecart/bundle-item-template'],
			renderAppender: false,
		}
	);

	const hasChildren = useSelect(
		(select) => select(blockEditorStore).getBlocks(clientId).length > 0,
		[clientId]
	);
	const { replaceInnerBlocks } = useDispatch(blockEditorStore);

	useEffect(() => {
		if (!hasChildren && clientId) {
			replaceInnerBlocks(clientId, [buildDefaultTree()], false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasChildren, clientId]);

	return (
		<div {...blockProps}>
			<div {...innerBlocksProps} />
		</div>
	);
};
