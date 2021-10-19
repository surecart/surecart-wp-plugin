/** @jsx jsx */
import { useState } from '@wordpress/element';
import {
	RadioControl,
	Button,
	TextControl,
	ToggleControl,
	Placeholder,
	SelectControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/core';
import { __experimentalLinkControl as LinkControl } from '@wordpress/block-editor';

import { Container, Draggable } from 'react-smooth-dnd';

import SelectProduct from './SelectProduct';
import ProductChoice from './ProductChoice';

export default ( { attributes, setAttributes, onCreate, onCancel, isNew } ) => {
	const {
		title,
		products,
		choice_type,
		custom_success_url,
		template,
	} = attributes;
	const [ open, setOpen ] = useState( false );

	const label = css`
		font-weight: 500;
		font-size: 1.2em;
		margin-bottom: 0.5em;
	`;

	const radio = css`
		margin: 0.5em 0;
		display: inline-flex;
		flex-direction: column;
		font-weight: 600;

		span {
			font-weight: 400;
		}
	`;

	return (
		<Placeholder
			isColumnLayout={ false }
			css={ css`
				font-family: var( --ce-font-sans );
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
					margin: 2em 0;
				` }
			>
				<div>
					<div css={ label }>
						{ __( 'Title', 'checkout_engine' ) }
					</div>
					<TextControl
						value={ title }
						placeholder={ __(
							'Enter a title for your form',
							'checkout_engine'
						) }
						onChange={ ( title ) => setAttributes( { title } ) }
					/>
				</div>

				<div
					css={ css`
						.ce-choice-item + .ce-choice-item {
							margin-top: 2em;
						}
					` }
				>
					<div css={ label }>
						{ __( 'Products', 'checkout_engine' ) }
					</div>
					{ ! Object.keys( products || {} ).length && (
						<p
							css={ css`
								font-size: 13px;
								opacity: 0.75;
							` }
						>
							{ __(
								'Click "Add Product" to add some products to this form.',
								'checkout_engine'
							) }
						</p>
					) }
					{ !! Object.keys( products || {} ).length && (
						<Container>
							{ Object.keys( products || {} ).map( ( id ) => {
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
											attributes={ attributes }
											setAttributes={ setAttributes }
										/>
									</Draggable>
								);
							} ) }
						</Container>
					) }
					<div
						css={ css`
							display: flex;
							gap: 0.5em;
							align-items: center;
						` }
					>
						<Button isPrimary onClick={ () => setOpen( true ) }>
							{ __( 'Add Product', 'checkout_engine' ) }
						</Button>
						<Button isSecondary onClick={ () => setOpen( true ) }>
							{ __( 'Create Product', 'checkout_engine' ) }
						</Button>
					</div>
				</div>

				<div>
					<div css={ label }>
						{ __( 'Product Options', 'checkout_engine' ) }
					</div>
					<RadioControl
						selected={ choice_type || 'all' }
						options={ [
							{
								label: (
									<div css={ radio }>
										{ __( 'All', 'checkout_engine' ) }
										<span>
											{ __(
												'All the prices are added to the form.',
												'checkout_engine'
											) }
										</span>
									</div>
								),
								value: 'all',
							},
							{
								label: (
									<div css={ radio }>
										{ __( 'Single', 'checkout_engine' ) }
										<span>
											{ __(
												'Users must select one price.',
												'checkout_engine'
											) }
										</span>
									</div>
								),
								value: 'single',
							},
							{
								label: (
									<div css={ radio }>
										{ __( 'Multiple', 'checkout_engine' ) }
										<span>
											{ __(
												'Users can select multiple prices.',
												'checkout_engine'
											) }
										</span>
									</div>
								),
								value: 'multiple',
							},
						] }
						onChange={ ( choice_type ) =>
							setAttributes( { choice_type } )
						}
					/>
				</div>

				{ isNew && (
					<div>
						<SelectControl
							label={ __( 'Template' ) }
							value={ template }
							onChange={ ( template ) =>
								setAttributes( { template } )
							}
							options={ [
								{
									value: null,
									label: 'Select a Template',
									disabled: true,
								},
								{ value: 'sections', label: 'Sections' },
								{ value: 'simple', label: 'Simple' },
							] }
						/>
					</div>
				) }

				<div>
					<div css={ label }>
						{ __( 'Thank You Page', 'checkout_engine' ) }
					</div>
					<ToggleControl
						label={ __(
							'Custom Thank You Page',
							'checkout_engine'
						) }
						checked={ custom_success_url }
						onChange={ ( custom_success_url ) =>
							setAttributes( { custom_success_url } )
						}
					/>
					{ custom_success_url && (
						<LinkControl
							value={ { url: attributes.success_url } }
							noURLSuggestion
							showInitialSuggestions
							onChange={ () => {} }
						/>
					) }
				</div>

				{ !! onCreate && (
					<div>
						<Button isPrimary onClick={ onCreate }>
							{ __( 'Create Form', 'checkout_engine' ) }
						</Button>
						{ onCancel && (
							<Button onClick={ onCancel }>
								{ __( 'Cancel', 'checkout_engine' ) }
							</Button>
						) }
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
		</Placeholder>
	);
};
