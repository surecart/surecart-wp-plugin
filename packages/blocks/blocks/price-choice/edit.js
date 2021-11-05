import { __ } from '@wordpress/i18n';
import { Fragment, useState, useEffect } from '@wordpress/element';
import {
	PanelBody,
	PanelRow,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import throttle from 'lodash/throttle';

/**
 * Component Dependencies
 */
import { CePriceChoice, CeSelect } from '@checkout-engine/react';
import PriceInfo from './components/PriceInfo';

export default ( { attributes, setAttributes, isSelected } ) => {
	const {
		price_id,
		label,
		description,
		type,
		quantity,
		checked,
	} = attributes;

	const [ query, setQuery ] = useState( '' );
	const [ busy, setBusy ] = useState( false );
	const [ prices, setPrices ] = useState( [] );

	const findPrice = throttle(
		( value ) => {
			setQuery( value );
		},
		750,
		{ leading: false }
	);

	useEffect( () => {
		if ( ! query ) return;
		fetchPrices();
	}, [ query ] );

	const fetchPrices = async () => {
		setBusy( true );
		try {
			const response = await apiFetch( {
				path: addQueryArgs( `checkout-engine/v1/prices`, {
					query,
					archived: false,
				} ),
			} );
			setPrices( response );
		} catch ( error ) {
			console.log( error );
		} finally {
			setBusy( false );
		}
	};

	const blockProps = useBlockProps();

	if ( ! price_id ) {
		return (
			<div { ...blockProps }>
				<CeSelect
					value={ price_id }
					onCeChange={ ( e ) => {
						setAttributes( { price_id: e.target.value } );
					} }
					loading={ busy }
					placeholder={ __( 'Select a price', 'checkout_engine' ) }
					searchPlaceholder={ __(
						'Search for a price...',
						'checkout_engine'
					) }
					search
					onCeSearch={ ( e ) => findPrice( e.detail ) }
					choices={ prices.map( ( price ) => {
						return {
							value: price.id,
							label: `${ price?.product?.name } \u2013 ${ price?.name }`,
						};
					} ) }
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
				</PanelBody>
			</InspectorControls>

			<CePriceChoice
				{ ...blockProps }
				priceId={ price_id }
				type={ type }
				label={ label }
				description={ description }
				checked={ checked }
				quantity={ quantity }
				onClick={ ( e ) => {
					e.preventDefault();
				} }
			/>
		</Fragment>
	);
};
