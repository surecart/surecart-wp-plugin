/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const { __ } = wp.i18n;
const { useState, useEffect } = wp.element;
const { BaseControl, RadioControl } = wp.components;

import Box from '../../ui/Box';

import {
	CeFormRow,
	CeInput,
	CePriceInput,
	CeRadioGroup,
	CeRadio,
} from '@checkout-engine/react';

export default ( { coupon, updateCoupon, loading } ) => {
	const [ type, setType ] = useState( 'percentage' );

	useEffect( () => {
		if ( coupon?.amount_off ) {
			setType( 'fixed' );
		}
	}, [ coupon?.amount_off ] );

	return (
		<Box title={ __( 'Amount', 'checkout_engine' ) } loading={ loading }>
			<CeFormRow>
				<CeRadioGroup
					label={ __( 'Choose a type', 'checkout_engine' ) }
					onCeChange={ ( e ) => setType( e.target.value ) }
				>
					<CeRadio
						value="percentage"
						checked={ type === 'percentage' }
					>
						{ __( 'Percentage Discount', 'checkout_engine' ) }
					</CeRadio>
					<CeRadio value="fixed" checked={ type === 'fixed' }>
						{ __( 'Fixed Discount', 'checkout_engine' ) }
					</CeRadio>
					{ /* <RadioControl
						className="ce-type"
						label={ __( 'Choose a type', 'checkout_engine' ) }
						selected={ type }
						options={ [
							{
								label: __(
									'Percentage Discount',
									'checkout_engine'
								),
								value: 'percentage',
							},
							{
								label: __(
									'Fixed Discount',
									'checkout_engine'
								),
								value: 'fixed',
							},
						] }
						onChange={ ( val ) => {
							setType( val );
						} }
					/> */ }
				</CeRadioGroup>
			</CeFormRow>
			<CeFormRow>
				{ type === 'percentage' ? (
					<CeInput
						className="ce-percent-off"
						type="number"
						min="0"
						max="100"
						attribute="percent_off"
						label={ __( 'Percent Off', 'checkout-engine' ) }
						value={ coupon?.percent_off || null }
						onChange={ ( e ) =>
							updateCoupon( {
								percent_off: e.target.detail,
							} )
						}
						required={ type === 'percentage' }
					>
						<span slot="suffix">%</span>
					</CeInput>
				) : (
					<CePriceInput
						className="ce-amount-off"
						currencyCode={ coupon?.currency }
						attribute="amount_off"
						label={ __( 'Amount Off', 'checkout-engine' ) }
						value={ coupon?.amount_off || null }
						required={ type === 'fixed' }
						onCeChange={ ( e ) => {
							updateCoupon( {
								amount_off: e.target.value,
							} );
						} }
					/>
				) }
			</CeFormRow>
		</Box>
	);
};
