const { __ } = wp.i18n;

import { CeSwitch } from '@checkout-engine/react';

import useProductData from '../hooks/useProductData';

// hocs
import withConfirm from '../../hocs/withConfirm';

export default withConfirm( ( { setConfirm, children } ) => {
	const { product, saveProduct, updateProduct, isSaving } = useProductData();

	const toggleArchive = async () => {
		updateProduct( { archived: ! product?.archived } );
		await saveProduct();
		setConfirm( {} );
	};

	const confirmArchive = () => {
		setConfirm( {
			title: product?.archived_at
				? sprintf(
						__( 'Un-Archive %s?', 'checkout_engine' ),
						product?.name || 'Product'
				  )
				: sprintf(
						__( 'Archive %s?', 'checkout_engine' ),
						product?.name || 'Product'
				  ),
			message: product?.archived_at
				? __(
						'This will make the product purchaseable again.',
						'checkout_engine'
				  )
				: __(
						'This product will not be purchaseable and all unsaved changes will be lost.',
						'checkout_engine'
				  ),
			confirmButtonText: product?.archived_at
				? sprintf(
						__( 'Un-Archive %s?', 'checkout_engine' ),
						product?.name || 'Product'
				  )
				: sprintf(
						__( 'Archive %s?', 'checkout_engine' ),
						product?.name || 'Product'
				  ),
			open: true,
			isSaving,
			className: 'ce-disable-confirm',
			isDestructive: true,
			onRequestClose: () => setConfirm( {} ),
			onRequestConfirm: toggleArchive,
		} );
	};

	return (
		<CeSwitch
			checked={ ! product?.archived }
			onCeChange={ () => {
				confirmArchive();
			} }
		>
			{ children }
		</CeSwitch>
	);
} );
