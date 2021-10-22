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
	Disabled,
} from '@wordpress/components';

/**
 * Component Dependencies
 */
import { CeInput } from '@checkout-engine/react';

export default ( { attributes, setAttributes } ) => {
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

			<Disabled>
				<CeInput
					label={ label }
					placeholder={ placeholder }
					name="name"
					help={ help }
				></CeInput>
			</Disabled>
		</Fragment>
	);
};
