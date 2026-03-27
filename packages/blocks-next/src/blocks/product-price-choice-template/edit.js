/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	__experimentalUseInnerBlocksProps,
	useInnerBlocksProps as __stableUseInnerBlocksProps,
} from '@wordpress/block-editor';
import ColorInspectorControl from '../../components/ColorInspectorControl';

const TEMPLATE = [
	['surecart/price-name', {}, []],
	[
		'core/group',
		{
			style: { spacing: { blockGap: '0px' } },
			layout: {
				type: 'flex',
				orientation: 'vertical',
				justifyContent: 'right',
			},
		},
		[
			[
				'core/group',
				{
					style: {
						spacing: { blockGap: '0.5rem' },
					},
					layout: {
						type: 'flex',
						flexWrap: 'nowrap',
						justifyContent: 'left',
					},
				},
				[
					[
						'surecart/price-scratch-amount',
						{
							style: {
								typography: {
									fontStyle: 'normal',
									fontWeight: '700',
									textDecoration: 'line-through',
								},
								color: { text: '#686868' },
							},
						},
						[],
					],
					[
						'surecart/price-amount',
						{
							style: {
								typography: {
									fontStyle: 'normal',
									fontWeight: '700',
								},
							},
						},
						[],
					],
					[
						'surecart/price-interval',
						{
							style: {
								typography: {
									fontStyle: 'normal',
									fontWeight: '700',
								},
							},
						},
						[],
					],
				],
			],
			[
				'surecart/price-trial',
				{
					style: {
						color: { text: '#8a8a8a' },
						elements: { link: { color: { text: '#8a8a8a' } } },
					},
					fontSize: 'small',
				},
				[],
			],
			[
				'surecart/price-setup-fee',
				{
					style: {
						color: { text: '#8a8a8a' },
						elements: { link: { color: { text: '#8a8a8a' } } },
					},
					fontSize: 'small',
				},
				[],
			],
		],
	],
];

export default ({
	__unstableLayoutClassNames,
	attributes,
	setAttributes,
	clientId,
	context,
}) => {
	const { highlight_border } = attributes;
	const isChecked = context?.['surecart/price']?.checked || false;
	const blockProps = useBlockProps({
		className: `sc-choice ${__unstableLayoutClassNames} ${
			isChecked ? 'sc-choice--checked' : ''
		}`,
		style: {
			borderColor: isChecked ? highlight_border : undefined,
			boxShadow: isChecked ? `0 0 0 1px ${highlight_border}` : undefined,
		},
	});

	const useInnerBlocksProps = __stableUseInnerBlocksProps
		? __stableUseInnerBlocksProps
		: __experimentalUseInnerBlocksProps;

	const innerBlocksProps = useInnerBlocksProps(
		{
			...blockProps,
			style: {
				...(blockProps.style || {}),
				width: '100%',
			},
		},
		{
			template: TEMPLATE,
			templateLock: false,
			renderAppender: false,
		}
	);

	return (
		<>
			<ColorInspectorControl
				settings={[
					{
						colorValue: highlight_border,
						label: __('Highlight Border', 'surecart'),
						onColorChange: (highlight_border) =>
							setAttributes({ highlight_border }),
						resetAllFilter: () =>
							setAttributes({
								highlight_border: undefined,
							}),
					},
				]}
				panelId={clientId}
			/>
			<div {...innerBlocksProps}></div>
		</>
	);
};
