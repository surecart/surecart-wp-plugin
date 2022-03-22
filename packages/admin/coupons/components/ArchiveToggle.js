import { __ } from '@wordpress/i18n';

import { ScSwitch } from '@surecart/components-react';

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
						__( 'Un-Archive %s?', 'surecart' ),
						promotion?.name || 'Coupon'
				  )
				: sprintf(
						__( 'Archive %s?', 'surecart' ),
						promotion?.name || 'Coupon'
				  ),
			message: promotion?.archived_at
				? __(
						'This will make the coupon purchaseable again.',
						'surecart'
				  )
				: __(
						'This coupon will not be purchaseable and all unsaved changes will be lost.',
						'surecart
				  ),
			confirmButtonText: promotion?.archived_at
				? sprintf(
						__( 'Un-Archive %s?', 'surecart' ),
						promotion?.name || __( 'Coupon', 'surecart')
				  )
				: sprintf(
						__( 'Archive %s?', 'surecart'),
						promotion?.name || __( 'Coupon', 'surecart')
				  ),
			open: true,
			isSaving,
			className: 'sc-disable-confirm',
			isDestructive: true,
			onRequestClose: () => setConfirm( {} ),
			onRequestConfirm: toggleArchive,
		} );
	};

	return (
		<ScSwitch
			checked={ ! promotion?.archived }
			onClick={ ( e ) => {
				e.preventDefault();
				confirmArchive();
			} }
		>
			{ children }
		</ScSwitch>
	);
} );
