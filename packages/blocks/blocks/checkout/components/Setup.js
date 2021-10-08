/** @jsx jsx */
import {
	CeInput,
	CeButton,
	CeFormSection,
	CeRadioGroup,
	CeCard,
	CeRadio,
} from '@checkout-engine/react';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/core';
import { Placeholder } from '@wordpress/components';
import SelectProduct from './SelectProduct';
import Choice from './Choice';

export default ( { onCreate, attributes, setAttributes } ) => {
	const { title, choices } = attributes;
	const [ open, setOpen ] = useState( false );

	return (
		<Placeholder isColumnLayout={ true }>
			<div
				css={ css`
					font-size: 15px;
					display: flex;
					flex-direction: column;
					gap: 2em;
					padding: 2em;
				` }
			>
				<CeFormSection label={ __( 'Title', 'checkout_engine' ) }>
					<span slot="description">
						This is not public information.
					</span>
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

				<CeFormSection label="Products">
					<span slot="description">
						{ __(
							'Add some products to your form',
							'checkout_engine'
						) }
					</span>

					{ Object.keys( choices || {} ).map( ( id ) => {
						const product = choices[ id ];
						return (
							<Choice
								attributes={ attributes }
								setAttributes={ setAttributes }
								id={ id }
								key={ product.id }
								choice={ product }
							/>
						);
					} ) }
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
					<span slot="description">
						{ __(
							'Behavior of the product options.',
							'checkout_engine'
						) }
					</span>
					<CeRadioGroup>
						<CeRadio value="all" checked={ true }>
							{ __(
								'Customer must purchase all products',
								'checkout_engine'
							) }
						</CeRadio>
						<CeRadio value="radio">
							{ __(
								'Customer must select one price from the options.',
								'checkout_engine'
							) }
						</CeRadio>
						<CeRadio value="checkbox">
							{ __(
								'Customer can select multiple prices.',
								'checkout_engine'
							) }
						</CeRadio>
					</CeRadioGroup>
				</CeFormSection>

				<ce-divider style={ { width: '100%' } }></ce-divider>

				<div>
					<CeButton type="primary" onClick={ onCreate }>
						{ __( 'Create Form', 'checkout_engine' ) }
					</CeButton>
				</div>
			</div>

			{ open && (
				<SelectProduct
					attributes={ attributes }
					setAttributes={ setAttributes }
					onRequestClose={ () => setOpen( false ) }
				/>
			) }
		</Placeholder>
	);
};
