import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { PanelBody, PanelRow, ToggleControl } from '@wordpress/components';

const TEMPLATE = [
	[
		'surecart/product-list-filter-checkboxes',
		{
			style: {
				spacing: {
					blockGap: '0',
					margin: { top: '0', bottom: 'var:preset|spacing|10' },
				},
			},
		},
	],
];

export default ({ attributes: { sidebarOpen }, setAttributes }) => {
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
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
				</PanelBody>
			</InspectorControls>
			<div {...innerBlocksProps} />
		</>
	);
};
