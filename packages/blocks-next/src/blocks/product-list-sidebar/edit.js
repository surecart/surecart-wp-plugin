import {
	useBlockProps,
	InspectorControls,
	InnerBlocks,
	RichText,
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
					label: '<strong>Applied Filters</strong>',
					fontSize: 'medium',
				},
			],
			[
				'surecart/product-list-filter-tags-template',
				{
					label: '<strong>Applied Filters</strong>',
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
					label: '<strong>Clear all</strong>',
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
					label: '<strong>Sort by</strong>',
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
					label: '<strong>Filter by</strong>',
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
	attributes: { sidebarOpen, label },
	setAttributes,
	__unstableLayoutClassNames,
}) => {
	const blockProps = useBlockProps({
		className: `${__unstableLayoutClassNames}`,
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'surecart')}>
					<PanelRow>
						<ToggleControl
							label={__('Default Open?', 'surecart')}
							help={__(
								'Enable this if you want sidebar to be open by default.',
								'surecart'
							)}
							checked={sidebarOpen}
							onChange={(sidebarOpen) =>
								setAttributes({ sidebarOpen })
							}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Mobile Header Label', 'surecart')}
							value={label}
							onChange={(label) => setAttributes({ label })}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<InnerBlocks template={TEMPLATE} templateLock={false} />
			</div>
		</>
	);
};
