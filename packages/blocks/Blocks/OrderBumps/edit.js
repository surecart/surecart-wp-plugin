import { ScFormControl, ScOrderBump } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { useRef, useEffect } from '@wordpress/element';
import {
	Disabled,
	PanelBody,
	PanelRow,
	TextControl,
	ToggleControl,
} from '@wordpress/components';

const bumpData = {
	percent_off: 20,
	price: {
		currency: scBlockData?.currency || 'usd',
		amount: 1234,
		recurring_interval_count: 1,
		recurring_interval: 'month',
		product: {
			name: __('Product Name', 'surecart'),
		},
	},
};

export default ({ attributes, setAttributes }) => {
	const { label, show_control } = attributes;

	const blockProps = useBlockProps();
	const bumpRef = useRef();

	useEffect(() => {
		if (bumpRef.current) {
			bumpRef.current.bump = bumpData;
		}
	}, []);

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={__('Label', 'surecart')}
							value={label}
							onChange={(label) => setAttributes({ label })}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							__nextHasNoMarginBottom
							label={__('Show control', 'surecart')}
							checked={show_control}
							onChange={(show_control) =>
								setAttributes({ show_control })
							}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<ScFormControl label={label || __('Recommended', 'surecart')}>
					<Disabled>
						<div className="bumps__list">
							<ScOrderBump
								ref={bumpRef}
								showControl={show_control}
							/>
						</div>
					</Disabled>
				</ScFormControl>
			</div>
		</>
	);
};
