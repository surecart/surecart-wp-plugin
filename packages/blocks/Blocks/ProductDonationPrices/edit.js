/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	PanelRow,
	TextControl,
	RangeControl,
} from '@wordpress/components';
import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	__experimentalUseBorderProps as useBorderProps,
	__experimentalUseColorProps as useColorProps,
	__experimentalGetSpacingClassesAndStyles as useSpacingProps,
} from '@wordpress/block-editor';
import { getSpacingPresetCssVar } from '../../util';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

const TEMPLATE = [
	[
		'surecart/product-donation-price',
		{ recurring: true, label: __('Yes, count me in!', 'surecart') },
	],
	[
		'surecart/product-donation-price',
		{ recurring: false, label: __('No, donate once.', 'surecart') },
	],
];

export default ({ attributes, setAttributes, context }) => {
	const { label, columns, style } = attributes;
	const borderProps = useBorderProps(attributes);
	const colorProps = useColorProps(attributes);
	const spacingProps = useSpacingProps(attributes);

	const product_id = context['surecart/product-donation/product_id'];

	const product = useSelect(
		(select) =>
			select(coreStore).getEntityRecord(
				'surecart',
				'product',
				product_id,
				{ expand: ['prices'] }
			),
		[product_id]
	);

	const prices = (product?.prices?.data || []).filter(
		(price) => price?.ad_hoc && !price?.archived
	);

	const blockProps = useBlockProps({
		style: {
			'--columns': columns,
		},
		css: css`
			sc-product-donation-choices.wp-block {
				margin: 0;
			}
		`,
	});

	const { children, innerBlocksProps } = useInnerBlocksProps(blockProps, {
		allowedBlocks: ['surecart/product-donation-price'],
		renderAppender: false,
		orientation: columns > 1 ? 'horizontal' : 'vertical',
		template: TEMPLATE,
		templateLock: {
			remove: true,
		},
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							label={__('Label', 'surecart')}
							value={label}
							onChange={(label) => setAttributes({ label })}
						/>
					</PanelRow>
					<RangeControl
						__nextHasNoMarginBottom
						label={__('Columns')}
						value={columns}
						onChange={(columns) => setAttributes({ columns })}
						min={1}
						max={Math.max(2, columns)}
					/>
					{columns > 2 && (
						<Notice status="warning" isDismissible={false}>
							{__(
								'This column count exceeds the recommended amount and may cause visual breakage.'
							)}
						</Notice>
					)}
				</PanelBody>
			</InspectorControls>

			{prices?.length > 1 && (
				<div
					class="sc-product-donation-choices"
					{...innerBlocksProps}
					{...blockProps}
				>
					<sc-choices
						label={label}
						style={{
							'--columns': columns,
							border: 'none',
							'--sc-choice-text-color': colorProps?.style?.color,
							'--sc-choice-background-color':
								colorProps?.style?.backgroundColor,
							'--sc-choice-border-color':
								borderProps?.style?.borderColor,
							'--sc-choice-border-width':
								borderProps?.style?.borderWidth,
							'--sc-choice-border-radius':
								borderProps?.style?.borderRadius,
							'--sc-choice-padding-left':
								spacingProps?.style?.paddingLeft,
							'--sc-choice-padding-right':
								spacingProps?.style?.paddingRight,
							'--sc-choice-padding-top':
								spacingProps?.style?.paddingTop,
							'--sc-choice-padding-bottom':
								spacingProps?.style?.paddingBottom,
							'--sc-choices-gap':
								getSpacingPresetCssVar(
									style?.spacing?.blockGap
								) || '10px',
							marginTop: spacingProps?.style?.marginTop,
							marginLeft: spacingProps?.style?.marginLeft,
							marginRight: spacingProps?.style?.marginRight,
							marginBottom: spacingProps?.style?.marginBottom,
						}}
					>
						{children}
					</sc-choices>
				</div>
			)}
		</>
	);
};
