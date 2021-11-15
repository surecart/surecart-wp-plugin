import { __ } from '@wordpress/i18n';

import { CeSwitch } from '@checkout-engine/react';

// hocs
import withConfirm from '../../hocs/withConfirm';
import usePromotionData from '../hooks/usePromotionData';

export default withConfirm( ( { setConfirm, children } ) => {
	const { promotions, isSaving, togglePromotionArchive } = usePromotionData();
	const promotion = promotions?.[ 0 ];

	const toggleArchive = async () => {
		setConfirm( {} );
		togglePromotionArchive( 0 );
	};

	const confirmArchive = () => {
		setConfirm( {
			title: promotion?.archived_at
				? sprintf(
						__( 'Un-Archive %s?', 'checkout_engine' ),
						promotion?.name || 'Coupon'
				  )
				: sprintf(
						__( 'Archive %s?', 'checkout_engine' ),
						promotion?.name || 'Coupon'
				  ),
			message: promotion?.archived_at
				? __(
						'This will make the coupon purchaseable again.',
						'checkout_engine'
				  )
				: __(
						'This coupon will not be purchaseable and all unsaved changes will be lost.',
						'checkout_engine'
				  ),
			confirmButtonText: promotion?.archived_at
				? sprintf(
						__( 'Un-Archive %s?', 'checkout_engine' ),
						promotion?.name || __( 'Coupon', 'checkout_engine' )
				  )
				: sprintf(
						__( 'Archive %s?', 'checkout_engine' ),
						promotion?.name || __( 'Coupon', 'checkout_engine' )
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
			checked={ ! promotion?.archived }
			onClick={ ( e ) => {
				e.preventDefault();
				confirmArchive();
			} }
		>
			{ children }
		</CeSwitch>
	);
} );
