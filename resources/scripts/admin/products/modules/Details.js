const { __ } = wp.i18n;
const { BaseControl } = wp.components;

import Box from '../../ui/Box';

import { CeInput, CeFormRow } from '@checkout-engine/react';
import useProductData from '../hooks/useProductData';

export default () => {
	const { product, updateModel, loading } = useProductData();
	return (
		<Box title={ __( 'General', 'checkout_engine' ) } loading={ loading }>
			<div>
				<CeFormRow>
					<CeInput
						label={ __( 'Name', 'checkout_engine' ) }
						className="ce-product-name"
						help={ __(
							'A name for your product.',
							'checkout_engine'
						) }
						value={ product?.name }
						onCeChange={ ( e ) => {
							updateModel( 'product', { name: e.target.value } );
						} }
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
						name="description"
						onCeChange={ ( e ) => {
							updateModel( 'product', {
								description: e.target.value,
							} );
						} }
						required
					/>
				</CeFormRow>
			</div>
		</Box>
	);
};
