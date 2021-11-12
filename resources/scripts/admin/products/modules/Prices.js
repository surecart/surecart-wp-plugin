/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __, sprintf } from '@wordpress/i18n';
import { useState, Fragment } from '@wordpress/element';

import Box from '../../ui/Box';
import Price from '../components/price/index.js';
import useProductData from '../hooks/useProductData';

import { CeButton, CeSwitch } from '@checkout-engine/react';

export default () => {
	const {
		loading,
		prices,
		addPrice,
		archivedPrices,
		hasArchivedPrices,
		hasActivePrices,
	} = useProductData();

	const [ open, setOpen ] = useState();
	const [ showArchived, setShowArchived ] = useState( false );

	const renderPrices = () => {
		if ( ! prices?.length ) {
			return null;
		}

		return (
			<Fragment>
				{ renderPriceList() }
				{ !! hasArchivedPrices && (
					<div
						css={ css`
							> *:not( :last-child ) {
								margin-bottom: 20px;
							}
						` }
					>
						{ !! showArchived &&
							renderPriceList( { archived: true } ) }
					</div>
				) }
			</Fragment>
		);
	};

	const renderPriceList = ( { archived } = { archived: undefined } ) => {
		return prices.map( ( price, index ) => {
			if ( archived && ! price.archived ) return null;
			if ( ! archived && price.archived ) return null;

			return (
				<Price
					price={ price }
					prices={ prices }
					index={ index }
					key={ index }
					focused={ index === open }
					open={ open }
				/>
			);
		} );
	};

	return (
		<div>
			<Box
				title={ __( 'Pricing', 'checkout_engine' ) }
				description={
					! hasActivePrices ? __( 'Please add a price.' ) : ''
				}
				loading={ loading }
				footer={
					! loading && (
						<Fragment>
							<CeButton
								onClick={ ( e ) => {
									e.preventDefault();
									addPrice( {
										recurring: false,
									} );
									setOpen( prices?.length );
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
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<line x1="12" y1="5" x2="12" y2="19"></line>
									<line x1="5" y1="12" x2="19" y2="12"></line>
								</svg>
								{ __( 'Add Another Price', 'checkout_engine' ) }
							</CeButton>
							{ !! hasArchivedPrices && (
								<div
									css={ css`
										display: flex;
										justify-content: flex-end;
									` }
								>
									<CeSwitch
										checked={ !! showArchived }
										onClick={ ( e ) => {
											e.preventDefault();
											setShowArchived( ! showArchived );
										} }
									>
										{ sprintf(
											! showArchived
												? __(
														'Show %d Archived Prices',
														'checkout_engine'
												  )
												: __(
														'Hide %d Archived Prices',
														'checkout_engine'
												  ),
											archivedPrices?.length
										) }
									</CeSwitch>
								</div>
							) }
						</Fragment>
					)
				}
			>
				{ renderPrices() }
			</Box>
		</div>
	);
};
