import { __ } from '@wordpress/i18n';

import { CeInput, CeFormRow } from '@checkout-engine/react';
import Box from '../../ui/Box';

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
							updateModel( 'products', { name: e.target.value } );
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
							updateModel( 'products', {
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
