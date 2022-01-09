/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls, RichText } from '@wordpress/block-editor';
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
import { CeCheckbox } from '@checkout-engine/components-react';

export default ( { className, attributes, setAttributes, isSelected } ) => {
	const { label, value, checked, name, required } = attributes;

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={ __( 'Attributes', 'checkout-engine' ) }>
					<PanelRow>
						<ToggleControl
							label={ __( 'Required', 'checkout-engine' ) }
							checked={ required }
							onChange={ ( required ) =>
								setAttributes( { required } )
							}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={ __( 'Name', 'checkout-engine' ) }
							value={ name }
							onChange={ ( name ) => setAttributes( { name } ) }
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={ __( 'Label', 'checkout-engine' ) }
							value={ label }
							onChange={ ( label ) => setAttributes( { label } ) }
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={ __( 'Value', 'checkout-engine' ) }
							value={ value }
							onChange={ ( value ) => setAttributes( { value } ) }
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={ __(
								'Checked by default',
								'checkout-engine'
							) }
							checked={ checked }
							onChange={ ( checked ) =>
								setAttributes( { checked } )
							}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			{ /* <Disabled> */ }
			<CeCheckbox
				className={ className }
				name={ name }
				required={ required }
			>
				<RichText
					aria-label={ __( 'Secure Notice' ) }
					placeholder={ __( 'Add some checkbox text...' ) }
					value={ label }
					onChange={ ( label ) => setAttributes( { label } ) }
					withoutInteractiveFormatting
					allowedFormats={ [ 'core/bold', 'core/italic' ] }
				/>
			</CeCheckbox>
			{ /* </Disabled> */ }
		</Fragment>
	);
};
