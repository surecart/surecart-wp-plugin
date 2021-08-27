/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const { __ } = wp.i18n;
const { useState } = wp.element;
const { DropdownMenu } = wp.components;

import Box from '../../ui/Box';
import Price from '../components/Price';
import useProductData from '../hooks/useProductData';

import { CeButton } from '@checkout-engine/react';

export default () => {
	const {
		prices,
		addPrice,
		loading,
		deletePrice,
		updatePrice,
	} = useProductData();

	const [ open, setOpen ] = useState();

	const onDeletePrice = () => {
		deletePrice( price, index );
	};

	return (
		<div>
			<Box
				title={ __( 'Pricing', 'checkout_engine' ) }
				loading={ loading }
				footer={
					! loading && (
						<CeButton
							onClick={ ( e ) => {
								e.preventDefault();
								addPrice(
									{
										recurring: false,
										name: ! prices?.length
											? __( 'Default', 'checkout_engine' )
											: '',
									},
									prices.length
								);
								setOpen( prices.length );
							} }
						>
							<svg
								slot="prefix"
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="feather feather-plus"
							>
								<line x1="12" y1="5" x2="12" y2="19"></line>
								<line x1="5" y1="12" x2="19" y2="12"></line>
							</svg>
							{ __( 'Add Another Price', 'checkout_engine' ) }
						</CeButton>
					)
				}
			>
				{ prices.map( ( price, index ) => {
					return (
						<Price
							price={ price }
							prices={ prices }
							index={ index }
							key={ index }
							focused={ index === open }
							open={ index === open || prices?.length === 1 }
						/>
					);
				} ) }
			</Box>
		</div>
	);
};
