import { ScFormControl, ScOrderBump } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	Disabled,
	PanelBody,
	PanelRow,
	TextControl,
	ToggleControl,
} from '@wordpress/components';

export default ({ attributes, setAttributes }) => {
	const { label, show_control } = attributes;

	const blockProps = useBlockProps({
		label: label || __('Recommended', 'surecart'),
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
					<PanelRow>
						<ToggleControl
							label={__('Show control', 'surecart')}
							checked={show_control}
							onChange={(show_control) =>
								setAttributes({ show_control })
							}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<ScFormControl {...blockProps}>
				<Disabled>
					<div class="bumps__list">
						<ScOrderBump
							showControl={show_control}
							bump={{
								percent_off: 20,
								metadata: {
									description:
										"Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
								},
								price: {
									currency: scBlockData?.currency || 'usd',
									amount: 1234,
									recurring_interval_count: 1,
									recurring_interval: 'month',
									product: {
										name: 'Product Name',
										image_url:
											'https://source.unsplash.com/daily',
									},
								},
							}}
						/>
					</div>
				</Disabled>
			</ScFormControl>
		</>
	);
};
