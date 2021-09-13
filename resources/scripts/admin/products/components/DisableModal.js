import { __, sprintf } from '@wordpress/i18n';
import { Button, Modal } from '@wordpress/components';

export default ( {
	open,
	name,
	onRequestClose,
	onRequestDisable,
	isSaving,
} ) => {
	if ( ! open ) {
		return <></>;
	}

	return (
		<Modal
			className={ 'ce-disable-confirm' }
			title={ sprintf(
				__( 'Disable "%s"?', 'checkout_engine' ),
				name || 'Coupon'
			) }
			onRequestClose={ onRequestClose }
		>
			<p>
				{ __(
					'This discount code will not be usable and all unsaved changes will be lost.',
					'checkout_engine'
				) }
			</p>
			<Button
				isDestructive
				disabled={ isSaving }
				isBusy={ isSaving }
				onClick={ onRequestDisable }
			>
				{ __( 'Disable', 'checkout_engine' ) }
			</Button>
			<Button variant="secondary" onClick={ onRequestClose }>
				{ __( 'Cancel', 'checkout_engine' ) }
			</Button>
		</Modal>
	);
};
