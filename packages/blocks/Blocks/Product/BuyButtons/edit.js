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
import { name as buttonBlockName } from '../BuyButton';
import { __ } from '@wordpress/i18n';

const ALLOWED_BLOCKS = [buttonBlockName];

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
		return preferredStyleVariations?.value?.[buttonBlockName];
	}, []);

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		template: [
			[
				buttonBlockName,
				{
					className: preferredStyle && `is-style-${preferredStyle}`,
					text: __('Add To Cart', 'surecart'),
					add_to_cart: true,
					width: 100,
				},
			],
			[
				buttonBlockName,
				{
					className: preferredStyle && `is-style-${preferredStyle}`,
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
