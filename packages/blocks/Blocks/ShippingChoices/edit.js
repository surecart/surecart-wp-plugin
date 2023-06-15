/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
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
		amount: 200,
		currency: 'USD',
		shipping_method: {
			name: __('Standard', 'surecart'),
			description: __('1-2 days', 'surecart'),
		},
	},
	{
		id: '3KLDSFJ',
		amount: 300,
		currency: 'USD',
		shipping_method: {
			name: __('Express', 'surecart'),
			description: __('Next-day delivery', 'surecart'),
		},
	},
	{
		id: '4DKLJF9',
		amount: 150,
		currency: 'USD',
		shipping_method: {
			name: __('Economy', 'surecart'),
			description: __('3-5 days', 'surecart'),
		},
	},
];

export default ({ className, attributes, setAttributes }) => {
	const { label, showDescription } = attributes;

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Shipping Choices', 'surecart')}>
					<PanelRow>
						<TextControl
							label={__('Label', 'surecart')}
							value={label}
							onChange={(label) => setAttributes({ label })}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__('Show Description', 'surecart')}
							checked={showDescription}
							onChange={(showDescription) =>
								setAttributes({ showDescription })
							}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<ScShippingChoices
				className={className}
				label={label}
				shippingChoices={shippingMethods}
				showDescription={showDescription}
			/>
		</Fragment>
	);
};
