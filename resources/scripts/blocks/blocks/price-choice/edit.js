import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import {
	Disabled,
	PanelBody,
	PanelRow,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';

/**
 * Component Dependencies
 */
import { CePriceChoice } from '@checkout-engine/react';
import PriceInfo from './components/PriceInfo';

import PriceSelector from '../checkout/components/PriceSelector';

export default ( { attributes, setAttributes, isSelected } ) => {
	const {
		price_id,
		label,
		description,
		type,
		quantity,
		show_label,
		show_price,
		show_control,
		checked,
	} = attributes;

	const blockProps = useBlockProps( {
		style: { width: '100%' },
	} );

	if ( ! price_id ) {
		return (
			<div { ...blockProps }>
				<PriceSelector
					onSelect={ ( price_id ) => setAttributes( { price_id } ) }
				/>
			</div>
		);
	}

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={ __( 'Price Info', 'checkout-engine' ) }>
					<PanelRow>
						<PriceInfo price_id={ price_id } />
					</PanelRow>
				</PanelBody>
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
							label={ __( 'Description', 'checkout-engine' ) }
							value={ description }
							onChange={ ( description ) =>
								setAttributes( { description } )
							}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={ __(
								'Checked By Default',
								'checkout-engine'
							) }
							checked={ checked }
							onChange={ ( checked ) =>
								setAttributes( { checked } )
							}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={ __( 'Show Label', 'checkout-engine' ) }
							checked={ show_label }
							onChange={ ( show_label ) =>
								setAttributes( { show_label } )
							}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={ __(
								'Show Price Amount',
								'checkout-engine'
							) }
							checked={ show_price }
							onChange={ ( show_price ) =>
								setAttributes( { show_price } )
							}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={ __( 'Show control', 'checkout-engine' ) }
							checked={ show_control }
							onChange={ ( show_control ) =>
								setAttributes( { show_control } )
							}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<CePriceChoice
				{ ...blockProps }
				onClick={ ( e ) => e.preventDefault() }
				priceId={ price_id }
				type={ type }
				label={ label }
				showLabel={ show_label }
				showPrice={ show_price }
				showControl={ show_control }
				description={ description }
				checked={ checked }
				quantity={ quantity }
			/>
		</Fragment>
	);
};
