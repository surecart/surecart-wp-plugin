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
		'surecart/product-list-filter-checkboxes',
		{
			style: {
				spacing: {
					blockGap: '0',
					margin: { top: '0', bottom: '0' },
				},
				layout: {
					type: 'flex',
					orientation: 'vertical',
				},
			},
		},
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
