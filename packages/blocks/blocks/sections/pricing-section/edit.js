/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/editor';
import { Fragment } from '@wordpress/element';
import {
	PanelBody,
	PanelRow,
	TextControl,
	RadioControl,
	RangeControl,
} from '@wordpress/components';

/**
 * Component Dependencies
 */
import { CePriceChoices } from '@checkout-engine/react';

export default ( { attributes, setAttributes, isSelected } ) => {
	const { default: defaultChoice, columns, type, label } = attributes;

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
						<RadioControl
							label={ __( 'Type', 'checkout_engine' ) }
							help="The type of product selection"
							selected={ type }
							options={ [
								{
									label: __( 'Choose one', 'checkout_egine' ),
									value: 'radio',
								},
								{
									label: __(
										'Choose many',
										'checkout_engine'
									),
									value: 'checkbox',
								},
							] }
							onChange={ ( type ) => setAttributes( { type } ) }
						/>
					</PanelRow>
					<PanelRow>
						<RangeControl
							label={ __( 'Columns', 'checkout_engine' ) }
							value={ columns }
							onChange={ ( columns ) =>
								setAttributes( { columns } )
							}
							min={ 1 }
							max={ 3 }
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<CePriceChoices
				label={ label }
				columns={ columns }
				type={ type }
				default={ defaultChoice }
			></CePriceChoices>
		</Fragment>
	);
};
