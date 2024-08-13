/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import {
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { __ } from '@wordpress/i18n';

const BUTTON_BLOCK_NAME = 'surecart/product-buy-button';
const ALLOWED_BLOCKS = [
	BUTTON_BLOCK_NAME,
	'surecart/product-selected-price-ad-hoc-amount',
];

export default ({ attributes, className }) => {
	const { fontSize, layout, style } = attributes;
	const blockProps = useBlockProps({
		className: classnames(className, {
			'wp-block-buttons': true,
			'has-custom-font-size': fontSize || style?.typography?.fontSize,
		}),
	});
	const preferredStyle = useSelect((select) => {
		const preferredStyleVariations =
			select(blockEditorStore).getSettings()
				.__experimentalPreferredStyleVariations;
		return preferredStyleVariations?.value?.[BUTTON_BLOCK_NAME];
	}, []);

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		template: [
			[
				BUTTON_BLOCK_NAME,
				{
					className: preferredStyle && `is-style-${preferredStyle}`,
					text: __('Add To Cart', 'surecart'),
					add_to_cart: true,
					width: 100,
				},
			],
			[
				BUTTON_BLOCK_NAME,
				{
					className: preferredStyle
						? `is-style-${preferredStyle}`
						: 'is-style-outline',
					text: __('Buy Now', 'surecart'),
					add_to_cart: false,
					width: 100,
					style: 'outline',
				},
			],
		],
		templateInsertUpdatesSelection: true,
		orientation: layout?.orientation ?? 'horizontal',
	});

	return <div {...innerBlocksProps} />;
};
