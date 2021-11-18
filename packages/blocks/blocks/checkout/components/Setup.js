/** @jsx jsx */
import { useState, useEffect } from '@wordpress/element';
import {
	RadioControl,
	Button,
	TextControl,
	ToggleControl,
	SelectControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/core';
import { __experimentalLinkControl as LinkControl } from '@wordpress/block-editor';

import SelectProductModal from './SelectProductModal';
import ProductChoice from './ProductChoice';
import { getProductIdsFromChoices } from '../../../utils/prices';
import SelectProduct from '../../../components/SelectProduct';
import PriceChoices from './PriceChoices';

export default ( { attributes, setAttributes, onCreate, onCancel, isNew } ) => {
	const {
		title,
		prices,
		choices,
		create_user_account,
		custom_success_url,
		template,
	} = attributes;

	const [ open, setOpen ] = useState( false );
	const [ productIds, setProductIds ] = useState( [] );

	// get unique product ids when prices are set
	useEffect( () => {
		setProductIds( getProductIdsFromChoices( prices ) );
	}, [ prices ] );

	const onAddProduct = ( choices ) => {
		setAttributes( { choices } );
	};

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
		<div
			css={ css`
				font-family: var( --ce-font-sans );
				font-size: 13px;

				box-sizing: border-box;
				position: relative;
				padding: 3em;
				min-height: 200px;
				width: 100%;
				text-align: left;
				margin: 0;
				color: #1e1e1e;
				-moz-font-smoothing: subpixel-antialiased;
				-webkit-font-smoothing: subpixel-antialiased;
				border-radius: 2px;
				background-color: #fff;
				box-shadow: inset 0 0 0 1px var( --ce-color-gray-300 );
				outline: 1px solid transparent;
			` }
		>
			<div
				css={ css`
					font-size: 14px;
					display: flex;
					flex-direction: column;
					gap: 2em;
				` }
			>
				{ isNew && (
					<div>
						<div css={ label }>
							{ __( 'Form Title', 'checkout_engine' ) }
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
				) }

				<div>
					<div css={ label }>
						{ __( 'Products', 'checkout_engine' ) }
					</div>
					<PriceChoices
						attributes={ attributes }
						setAttributes={ setAttributes }
					/>
				</div>

				{ isNew && (
					<div>
						<div css={ label }>
							{ __( 'Design', 'checkout_engine' ) }
						</div>
						<SelectControl
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
						{ __( 'User Account', 'checkout_engine' ) }
					</div>
					<ToggleControl
						label={ __(
							'Automatically create a user account when purchased.',
							'checkout_engine'
						) }
						checked={ create_user_account }
						onChange={ ( create_user_account ) =>
							setAttributes( { create_user_account } )
						}
					/>
				</div>

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

			{ open && <SelectProduct onSelect={ ( value ) => value() } /> }
		</div>
	);
};
