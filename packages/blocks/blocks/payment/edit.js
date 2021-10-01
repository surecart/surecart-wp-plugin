/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/editor';
import { Fragment } from '@wordpress/element';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';

/**
 * Component Dependencies
 */
import { CePayment } from '@checkout-engine/react';

export default ( { className, attributes, setAttributes } ) => {
	const { label, secure_notice } = attributes;

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
							label={ __( 'Secure Notice', 'checkout-engine' ) }
							value={ secure_notice }
							onChange={ ( secure_notice ) =>
								setAttributes( { secure_notice } )
							}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<CePayment
				className={ className }
				label={ label }
				secureNotice={ secure_notice }
			></CePayment>
		</Fragment>
	);
};
