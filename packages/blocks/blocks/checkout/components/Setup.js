/** @jsx jsx */
import {
	CeInput,
	CeButton,
	CeFormSection,
	CeChoices,
	CeChoice,
} from '@checkout-engine/react';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/core';

import dotProp from 'dot-prop-immutable';
import { Container, Draggable } from 'react-smooth-dnd';

import SelectProduct from './SelectProduct';
import ProductChoice from './ProductChoice';

export default ( { onCreate, attributes, setAttributes } ) => {
	const { title, products } = attributes;
	const [ open, setOpen ] = useState( false );

	const removeChoice = ( id ) => {
		const r = confirm(
			__(
				'Are you sure you want to remove this product from the form?',
				'checkout_engine'
			)
		);
		if ( r ) {
			const { [ id ]: value, ...withoutProduct } = products;
			setAttributes( {
				products: withoutProduct,
			} );
		}
	};

	return (
		<div
			css={ css`
				.components-placeholder.components-placeholder {
					border-radius: var( --ce-border-radius-medium );
				}
			` }
		>
			<div
				css={ css`
					font-size: 14px;
					display: flex;
					flex-direction: column;
					gap: 2em;
					padding: 2em;
				` }
			>
				<CeFormSection label={ __( 'Title', 'checkout_engine' ) }>
					<CeInput
						value={ title }
						placeholder={ __(
							'Enter a title for your form',
							'checkout_engine'
						) }
						onChange={ ( e ) =>
							setAttributes( { title: e.target.value } )
						}
					/>
				</CeFormSection>

				<CeFormSection
					label="Products"
					css={ css`
						.ce-choice-item + .ce-choice-item {
							margin-top: 2em;
						}
					` }
				>
					<Container>
						{ Object.keys( products || {} ).map( ( id ) => {
							const product = products[ id ];
							return (
								<Draggable
									key={ id }
									className={ 'ce-choice-item' }
									css={ css`
										overflow: visible !important;
									` }
								>
									<ProductChoice
										id={ id }
										choice={ product }
										onRemove={ () => removeChoice( id ) }
										onUpdateChoice={ ( key, value ) => {
											setAttributes( {
												products: dotProp.set(
													attributes.products,
													`${ id }.${ key }`,
													value
												),
											} );
										} }
									/>
								</Draggable>
							);
						} ) }
					</Container>
					<div
						css={ css`
							display: flex;
							gap: 0.5em;
							align-items: center;
						` }
					>
						<CeButton
							type="primary"
							outline
							onClick={ () => setOpen( true ) }
						>
							{ __( 'Add Product', 'checkout_engine' ) }
						</CeButton>
						<CeButton onClick={ () => setOpen( true ) }>
							{ __( 'Create Product', 'checkout_engine' ) }
						</CeButton>
					</div>
				</CeFormSection>

				<CeFormSection
					label={ __( 'Product Options', 'checkout_engine' ) }
				>
					<CeChoices style={ { '--columns': 3 } }>
						<CeChoice value="all" checked={ true }>
							{ __(
								'All Products And Prices',
								'checkout_engine'
							) }
							<span slot="description">
								{ __(
									'Customer must purchase all products and their prices.',
									'checkout_engine'
								) }
							</span>
						</CeChoice>
						<CeChoice value="radio">
							{ __( 'Select One', 'checkout_engine' ) }
							<span slot="description">
								{ __(
									'Customer must select one price from the options.',
									'checkout_engine'
								) }
							</span>
						</CeChoice>
						<CeChoice value="checkbox">
							{ __( 'Pick And Choose', 'checkout_engine' ) }
							<span slot="description">
								{ __(
									'Customer can select multiple prices.',
									'checkout_engine'
								) }
							</span>
						</CeChoice>
					</CeChoices>
				</CeFormSection>

				{ !! onCreate && (
					<div>
						<CeButton type="primary" onClick={ onCreate }>
							{ __( 'Create Form', 'checkout_engine' ) }
						</CeButton>
					</div>
				) }
			</div>

			{ open && (
				<SelectProduct
					attributes={ attributes }
					setAttributes={ setAttributes }
					onRequestClose={ () => setOpen( false ) }
				/>
			) }
		</div>
	);
};
