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
	Disabled,
} from '@wordpress/components';

/**
 * Component Dependencies
 */
import { CeSwitch } from '@checkout-engine/react';

export default ( { className, attributes, setAttributes, isSelected } ) => {
	const { label, value, checked, name, required, description } = attributes;

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
							label={ __( 'Description', 'checkout-engine' ) }
							value={ description }
							onChange={ ( description ) =>
								setAttributes( { description } )
							}
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

			{ ! isSelected && ! name && <div>Please add a name</div> }

			<CeSwitch
				className={ className }
				name={ name }
				required={ required }
			>
				<RichText
					tagName="span"
					aria-label={ __( 'Switch label' ) }
					placeholder={ __( 'Add some text...' ) }
					value={ label }
					onChange={ ( label ) => setAttributes( { label } ) }
					withoutInteractiveFormatting
					allowedFormats={ [ 'core/bold', 'core/italic' ] }
				/>
				{ ( description || isSelected ) && (
					<RichText
						tagName="span"
						slot="description"
						aria-label={ __( 'Switch label' ) }
						placeholder={ __(
							'Enter a description...',
							'checkout_engine'
						) }
						value={ description }
						onChange={ ( description ) =>
							setAttributes( { description } )
						}
						withoutInteractiveFormatting
						allowedFormats={ [ 'core/bold', 'core/italic' ] }
					/>
				) }
			</CeSwitch>
		</Fragment>
	);
};
