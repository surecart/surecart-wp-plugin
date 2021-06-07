/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/editor';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';

export default ( { attributes, setAttributes } ) => {
	const {
		firstnameLabel,
		lastnameLabel,
		firstnameHelp,
		lastnameHelp,
	} = attributes;

	return (
		<InspectorControls>
			<PanelBody title={ __( 'Attributes', 'checkout-engine' ) }>
				<PanelRow>
					<TextControl
						label={ __( 'First Name Label', 'checkout-engine' ) }
						value={ firstnameLabel }
						onChange={ ( firstnameLabel ) =>
							setAttributes( { firstnameLabel } )
						}
					/>
				</PanelRow>
				<PanelRow>
					<TextControl
						label={ __( 'First Name Help', 'checkout-engine' ) }
						value={ firstnameHelp }
						onChange={ ( firstnameHelp ) =>
							setAttributes( { firstnameHelp } )
						}
					/>
				</PanelRow>
				<PanelRow>
					<TextControl
						label={ __( 'Last Name Label', 'checkout-engine' ) }
						value={ lastnameLabel }
						onChange={ ( lastnameLabel ) =>
							setAttributes( { lastnameLabel } )
						}
					/>
				</PanelRow>
				<PanelRow>
					<TextControl
						label={ __( 'First Name Help', 'checkout-engine' ) }
						value={ lastnameHelp }
						onChange={ ( lastnameHelp ) =>
							setAttributes( { lastnameHelp } )
						}
					/>
				</PanelRow>
			</PanelBody>
		</InspectorControls>
	);
};
