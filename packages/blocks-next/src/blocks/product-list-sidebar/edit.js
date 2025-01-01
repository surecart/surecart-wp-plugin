import {
	useBlockProps,
	InspectorControls,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	PanelRow,
	ToggleControl,
	TextControl,
} from '@wordpress/components';

const TEMPLATE = [
	[
		'surecart/product-list-filter-tags',
		{
			layout: {
				type: 'flex',
				orientation: 'vertical',
			},
		},
		[
			[
				'surecart/product-list-filter-tags-label',
				{
					label: 'Applied Filters',
					fontSize: 'medium',
				},
			],
			[
				'surecart/product-list-filter-tags-template',
				{
					label: 'Applied Filters',
					style: {
						spacing: {
							blockGap: '8px',
						},
					},
					fontSize: 'medium',
				},
				[
					[
						'surecart/product-list-filter-tag',
						{
							style: {
								typography: {
									fontSize: '14px',
								},
							},
						},
					],
				],
			],
			[
				'surecart/product-list-filter-tags-clear-all',
				{
					label: 'Clear all',
					style: {
						typography: {
							textDecoration: 'underline',
						},
					},
					fontSize: 'small',
				},
			],
		],
	],
	[
		'surecart/product-list-sort-radio-group',
		{
			layout: {
				type: 'flex',
				orientation: 'vertical',
			},
			style: {
				spacing: {
					blockGap: '4px',
				},
			},
		},
		[
			[
				'surecart/product-list-sort-radio-group-label',
				{
					label: 'Sort by',
					fontSize: 'medium',
				},
			],
			[
				'surecart/product-list-sort-radio-group-template',
				{
					style: {
						spacing: {
							blockGap: '4px',
						},
					},
					fontSize: 'medium',
				},
				[['surecart/product-list-sort-radio', {}]],
			],
		],
	],
	[
		'surecart/product-list-filter-checkboxes',
		{
			layout: {
				type: 'flex',
				orientation: 'vertical',
			},
			style: {
				spacing: {
					blockGap: '4px',
				},
			},
		},
		[
			[
				'surecart/product-list-filter-checkboxes-label',
				{
					label: 'Filter by',
					fontSize: 'medium',
				},
			],
			[
				'surecart/product-list-filter-checkboxes-template',
				{
					style: {
						spacing: {
							blockGap: '4px',
							margin: { top: '0', bottom: '0' },
						},
					},
					fontSize: 'medium',
				},
				[['surecart/product-list-filter-checkbox', {}]],
			],
		],
	],
];

export default ({
	attributes: { open, label },
	setAttributes,
	__unstableLayoutClassNames,
}) => {
	const blockProps = useBlockProps({
		className: `${__unstableLayoutClassNames}`,
	});

	const innerBlockProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
		templateLock: false,
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'surecart')}>
					<ToggleControl
						label={__('Open by default', 'surecart')}
						help={__(
							'Do you want sidebar to be open by default?',
							'surecart'
						)}
						checked={open}
						onChange={(open) => setAttributes({ open })}
					/>

					<TextControl
						label={__('Mobile Label', 'surecart')}
						value={label}
						onChange={(label) => setAttributes({ label })}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...innerBlockProps} />
		</>
	);
};
