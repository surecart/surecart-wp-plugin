/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';

import { CeInput } from '@checkout-engine/react';
import Box from '../../ui/Box';

import useProductData from '../hooks/useProductData';
import useValidationErrors from '../../hooks/useValidationErrors';

export default () => {
	const { product, updateModel, loading } = useProductData();
	const { errors, getValidation } = useValidationErrors( 'products' );
	return (
		<Box title={ __( 'General', 'checkout_engine' ) } loading={ loading }>
			<div
				css={ css`
					display: grid;
					gap: var( --ce-form-row-spacing );
				` }
			>
				<CeInput
					label={ __( 'Name', 'checkout_engine' ) }
					className="ce-product-name hydrated"
					help={ __( 'A name for your product.', 'checkout_engine' ) }
					value={ product?.name }
					onCeChange={ ( e ) => {
						updateModel( 'products', { name: e.target.value } );
					} }
					errorMessage={ getValidation( 'name' ) }
					name="name"
					required
				/>
				<CeInput
					label={ __( 'Description', 'checkout_engine' ) }
					className="ce-product-description"
					help={ __(
						'A short description for your product.',
						'checkout_engine'
					) }
					value={ product?.description }
					errorMessage={ getValidation( 'description' ) }
					name="description"
					onCeChange={ ( e ) => {
						updateModel( 'products', {
							description: e.target.value,
						} );
					} }
					required
				/>
			</div>
		</Box>
	);
};
