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
	RadioControl,
	RangeControl,
} from '@wordpress/components';

/**
 * Component Dependencies
 */
import { CePriceChoices } from '@checkout-engine/react';

export default ( { attributes, setAttributes, isSelected } ) => {
	const {
		default: defaultChoice,
		columns,
		type,
		product_label,
		price_label,
	} = attributes;

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={ __( 'Attributes', 'checkout-engine' ) }>
					<PanelRow>
						<TextControl
							label={ __( 'Label', 'checkout-engine' ) }
							value={ product_label }
							onChange={ ( product_label ) =>
								setAttributes( { product_label } )
							}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={ __( 'Label', 'checkout-engine' ) }
							value={ price_label }
							onChange={ ( price_label ) =>
								setAttributes( { price_label } )
							}
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
				productLabel={ product_label }
				priceLabel={ price_label }
				columns={ columns }
				default={ defaultChoice }
			></CePriceChoices>
		</Fragment>
	);
};
