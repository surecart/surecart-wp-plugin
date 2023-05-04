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

const DEFAULT_BLOCK = {
	name: buttonBlockName,
	attributesToCopy: [
		'backgroundColor',
		'border',
		'className',
		'fontFamily',
		'fontSize',
		'gradient',
		'style',
		'textColor',
		'width',
	],
};

export default ({ attributes, setAttributes, className }) => {
	const { fontSize, style } = attributes;
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
		__experimentalDefaultBlock: DEFAULT_BLOCK,
		__experimentalDirectInsert: true,
		template: [
			[
				buttonBlockName,
				{
					className: preferredStyle && `is-style-${preferredStyle}`,
					text: __('Add To Cart', 'surecart'),
				},
			],
			[
				buttonBlockName,
				{
					className: preferredStyle && `is-style-${preferredStyle}`,
					text: __('Buy Now', 'surecart'),
				},
			],
		],
		templateInsertUpdatesSelection: true,
	});

	return <div {...innerBlocksProps} />;
};
