/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { Fragment, useRef, useEffect } from '@wordpress/element';
import {
	PanelBody,
	PanelRow,
	TextControl,
	ToggleControl,
} from '@wordpress/components';

/**
 * Component Dependencies
 */
import { ScShippingChoices } from '@surecart/components-react';

const shippingMethods = [
	{
		id: '2JLDFJ3',
		display_amount: '$2.00',
		shipping_method: {
			name: __('Standard', 'surecart'),
			description: __('1-2 days', 'surecart'),
		},
	},
	{
		id: '3KLDSFJ',
		display_amount: '$3.00',
		shipping_method: {
			name: __('Express', 'surecart'),
			description: __('Next-day delivery', 'surecart'),
		},
	},
	{
		id: '4DKLJF9',
		display_amount: '$1.50',
		shipping_method: {
			name: __('Economy', 'surecart'),
			description: __('3-5 days', 'surecart'),
		},
	},
];

export default ({ attributes, setAttributes }) => {
	const { label, showDescription } = attributes;

	const blockProps = useBlockProps();
	const ref = useRef();

	useEffect(() => {
		if (ref.current) {
			ref.current.shippingChoices = shippingMethods;
		}
	}, []);

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Shipping Choices', 'surecart')}>
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
							label={__('Show Description', 'surecart')}
							checked={showDescription}
							onChange={(showDescription) =>
								setAttributes({ showDescription })
							}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<ScShippingChoices
					ref={ref}
					label={label}
					showDescription={showDescription}
				/>
			</div>
		</Fragment>
	);
};
