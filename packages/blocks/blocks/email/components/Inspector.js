/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/editor';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';

export default ( { attributes, setAttributes } ) => {
	const { label, placeholder } = attributes;

	return (
		<InspectorControls>
			<PanelBody title={ __( 'Attributes', 'checkout-engine' ) }>
				<PanelRow>
					<TextControl
						label={ __( 'Label', 'checkout-engine' ) }
						value={ label }
						onChange={ ( label ) => setAttributes( { label } ) }
					/>
				</PanelRow>
				<PanelRow>
					<TextControl
						label={ __( 'Placeholder', 'checkout-engine' ) }
						value={ placeholder }
						onChange={ ( placeholder ) =>
							setAttributes( { placeholder } )
						}
					/>
				</PanelRow>
			</PanelBody>
		</InspectorControls>
	);
};
