/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls, RichText } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';

/**
 * Component Dependencies
 */
import { CePayment } from '@checkout-engine/components-react';

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

			<CePayment className={ className } label={ label }>
				<RichText
					aria-label={ __( 'Secure Notice' ) }
					placeholder={ __( 'Add some secure notice text...' ) }
					value={ secure_notice }
					onChange={ ( secure_notice ) =>
						setAttributes( { secure_notice } )
					}
					withoutInteractiveFormatting
					allowedFormats={ [ 'core/bold', 'core/italic' ] }
				/>
			</CePayment>
		</Fragment>
	);
};
