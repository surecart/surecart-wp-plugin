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

export default ({ className, attributes, setAttributes }) => {
	const { showControl, label } = attributes;

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
							label={__('Show control', 'surecart')}
							checked={showControl}
							onChange={(showControl) =>
								setAttributes({ showControl })
							}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<ScShippingChoices
				showControl={showControl}
				label={label}
				className={className}
			></ScShippingChoices>
		</Fragment>
	);
};
