/**
 * WordPress dependencies.
 */
import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps as __stableUseInnerBlocksProps,
	__experimentalUseInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const CHILD_STYLE = {
	style: { typography: { fontSize: '14px', lineHeight: '1.4' } },
};

const ALLOWED_BLOCKS = [
	'surecart/cart-line-item-variant',
	'surecart/cart-line-item-note',
];

/**
 * Seed the two default child blocks (variant + note).
 */
const buildDefaultChildren = () => [
	createBlock('surecart/cart-line-item-variant', CHILD_STYLE),
	createBlock('surecart/cart-line-item-note', CHILD_STYLE),
];

export default ({ clientId, attributes, setAttributes }) => {
	const { expanded = false, collapseAfter = 2 } = attributes;

	const blockProps = useBlockProps({
		className: `sc-cart-line-item-details${
			expanded ? ' sc-cart-line-item-details--is-expanded' : ''
		}`,
	});

	const useInnerBlocksProps = __stableUseInnerBlocksProps
		? __stableUseInnerBlocksProps
		: __experimentalUseInnerBlocksProps;

	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'sc-cart-line-item-details__content' },
		{
			templateLock: false,
			allowedBlocks: ALLOWED_BLOCKS,
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
			replaceInnerBlocks(clientId, buildDefaultChildren(), false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasChildren, clientId]);

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Details', 'surecart')}>
					<ToggleControl
						label={__('Expanded by default', 'surecart')}
						help={__(
							'When on, the details (variant, bundle items, note) show expanded on load. When off, they stay collapsed until the shopper expands them.',
							'surecart'
						)}
						checked={expanded}
						onChange={(value) => setAttributes({ expanded: value })}
					/>
					<RangeControl
						label={__('Collapse after (lines)', 'surecart')}
						help={__(
							'The expand toggle only shows when the details exceed this many lines.',
							'surecart'
						)}
						value={collapseAfter}
						onChange={(value) =>
							setAttributes({ collapseAfter: value || 2 })
						}
						min={1}
						max={6}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<div {...innerBlocksProps} />
				<span
					className={`sc-cart-line-item-details__toggle${
						expanded
							? ' sc-cart-line-item-details__toggle--rotated'
							: ''
					}`}
					aria-hidden="true"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<polyline points="6 9 12 15 18 9"></polyline>
					</svg>
				</span>
			</div>
		</>
	);
};
