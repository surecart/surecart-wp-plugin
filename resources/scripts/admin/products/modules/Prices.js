/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const { __ } = wp.i18n;
const { useState } = wp.element;
const { Button, Panel, PanelBody } = wp.components;

import Box from '../../ui/Box';
import Price from '../components/Price';

export default ( { prices, loading, updatePrice, addPrice } ) => {
	return (
		<Box
			title={ __( 'Price Information', 'checkout_engine' ) }
			loading={ loading }
		>
			<Panel>
				{ prices.map( ( price, index ) => {
					return (
						<PanelBody
							title={
								price?.name ||
								__( 'Price details', 'checkout_engine' )
							}
						>
							<Price
								initialOpen={ index === 0 }
								price={ price }
								updatePrice={ updatePrice }
								index={ index }
								key={ index }
							/>
						</PanelBody>
					);
				} ) }
			</Panel>
			<Button
				isPrimary
				variant="primary"
				onClick={ ( e ) => {
					addPrice( { recurring: false }, prices.length );
				} }
			>
				{ __( 'Add Another Price', 'checkout_engine' ) }
			</Button>
		</Box>
	);
};
