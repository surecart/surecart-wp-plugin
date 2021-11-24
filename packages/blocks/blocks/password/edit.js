/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';

/**
 * Component Dependencies
 */
import { CeInput } from '@checkout-engine/react';

export default ( { className, attributes, setAttributes, isSelected } ) => {
	const { label, placeholder, help, name } = attributes;

	return (
		<Fragment>
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
					<PanelRow>
						<TextControl
							label={ __( 'Help', 'checkout-engine' ) }
							value={ help }
							onChange={ ( help ) => setAttributes( { help } ) }
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<CeInput
				className={ className }
				name={ 'password' }
				label={ label }
				placeholder={ placeholder }
				required={ true }
				type={ 'password' }
				help={ help }
			></CeInput>
		</Fragment>
	);
};
