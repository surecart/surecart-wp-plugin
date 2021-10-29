/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';
/**
 * Component Dependencies
 */
import { CeCouponForm } from '@checkout-engine/react';

export default ( { attributes, setAttributes } ) => {
	const { text, button_text } = attributes;

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={ __( 'Attributes', 'checkout-engine' ) }>
					<PanelRow>
						<TextControl
							label={ __( 'Text', 'checkout-engine' ) }
							value={ text }
							onChange={ ( text ) => setAttributes( { text } ) }
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={ __( 'Button Text', 'checkout-engine' ) }
							value={ button_text }
							onChange={ ( button_text ) =>
								setAttributes( { button_text } )
							}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<CeCouponForm label={ text }>{ button_text }</CeCouponForm>
		</Fragment>
	);
};
