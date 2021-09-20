/** @jsx jsx */

import dotProp from 'dot-prop';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import { useEffect, useState, useRef } from '@wordpress/element';
import { SelectControl } from '@wordpress/components';
import { addQueryArgs } from '@wordpress/url';
import { css, jsx } from '@emotion/core';
import { CeInput, CeButton, CeSelect } from '@checkout-engine/react';

export default ( { attributes, setAttributes } ) => {
	const { choices } = attributes;
	const [ products, setProducts ] = useState( [] );
	const [ query, setQuery ] = useState( '' );
	const [ items, setItems ] = useState( [] );
	const selector = useRef();

	useEffect( () => {
		fetchProducts();
	}, [] );

	useEffect( () => {
		const filtered = choices.map( ( choice ) => {
			return {
				customProperties: {
					type: choice.type,
				},
				value: choice.id,
				label: choice.label,
			};
		} );
		console.log( { filtered } );
		setItems( filtered );
	}, [ choices ] );

	const fetchProducts = async () => {
		let response = await apiFetch( {
			path: addQueryArgs( 'checkout-engine/v1/products', { query } ),
		} );
		let prices = [];

		const products = response.map( ( product ) => {
			if ( product?.prices.length > 1 ) {
				product.prices.forEach( ( price ) => {
					prices.push( {
						value: price.id,
						customProperties: {
							type: 'price',
						},
						label: `${ product.name }: ${ price.name }`,
					} );
				} );
			}

			return {
				value: product.id,
				customProperties: {
					type: 'product',
				},
				label: `${ product.name }: All Prices`,
			};
		} );

		setProducts( [ ...products, ...prices ] );
	};

	return (
		<CeSelect
			type="multiple"
			choices={ products }
			items={ items }
			// items={ () => {
			// 	const filtered = products.map( ( choice ) => {
			// 		return {
			// 			customProperties: {
			// 				type: choice.type,
			// 			},
			// 			id: choice.value,
			// 			label: choice.label,
			// 		};
			// 	} );
			// 	console.log( { filtered } );
			// 	return filtered;
			// } }
			onCeChange={ async ( e ) => {
				const items = await e.target.getValue();
				console.log( items );
				setAttributes( {
					choices: items.map( ( item ) => {
						return {
							type: item?.customProperties?.type,
							id: item.value,
							label: item.label,
						};
					} ),
				} );
			} }
		/>
	);

	return (
		<div>
			{ JSON.stringify( choices ) }
			{ JSON.stringify( attributes ) }
			{ choices.map( ( choice, choiceIndex ) => {
				return (
					<div key={ choiceIndex }>
						<CeInput
							label="Product ID"
							value={ choice.id }
							onCeChange={ ( e ) => {
								console.log(
									dotProp.set(
										choices,
										`${ choiceIndex }.id`,
										e.target.value
									)
								);
								setAttributes( {
									choices: dotProp.set(
										choices,
										`${ choiceIndex }.id`,
										e.target.value
									),
								} );
							} }
						/>
						{ !! choice?.prices?.length &&
							choice?.prices.map( ( price, priceIndex ) => {
								return (
									<CeInput
										label="Price ID"
										value={ price }
										key={ priceIndex }
										onCeChange={ ( e ) => {
											console.log(
												e.target.value,
												`${ choiceIndex }.prices.${ priceIndex }`
											);
											setAttributes( {
												choices: dotProp.set(
													choices,
													`${ choiceIndex }.prices.${ priceIndex }`,
													e.target.value
												),
											} );
										} }
									/>
								);
							} ) }
						<CeButton
							onClick={ () => {
								setAttributes( {
									choices: [
										...choices,
										{
											prices: choice?.prices.push( '' ),
										},
									],
								} );
							} }
						>
							Add Price
						</CeButton>
					</div>
				);
			} ) }
			<CeButton
				onClick={ () => {
					setAttributes( {
						choices: [
							...choices,
							...[ { id: null, type: 'all', prices: [ '' ] } ],
						],
					} );
				} }
			>
				Add Product
			</CeButton>
		</div>
	);
};
