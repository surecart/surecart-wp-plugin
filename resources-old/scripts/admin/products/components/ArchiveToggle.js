import { __ } from '@wordpress/i18n';
import { dispatch } from '@wordpress/data';
import { STORE_KEY as DATA_STORE_KEY } from '../../store/data';

import { CeSwitch } from '@checkout-engine/components-react';

import useProductData from '../hooks/useProductData';

// hocs
import withConfirm from '../../hocs/withConfirm';

export default withConfirm( ( { setConfirm, children } ) => {
	const { product, isSaving, toggleArchiveModel } = useProductData();

	const toggleArchive = async () => {
		setConfirm( {} );
		toggleArchiveModel( 'products', 0 );
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
						product?.name || __( 'Product', 'checkout_engine' )
				  )
				: sprintf(
						__( 'Archive %s?', 'checkout_engine' ),
						product?.name || __( 'Product', 'checkout_engine' )
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
			onClick={ ( e ) => {
				e.preventDefault();
				confirmArchive();
			} }
		>
			{ children }
		</CeSwitch>
	);
} );
