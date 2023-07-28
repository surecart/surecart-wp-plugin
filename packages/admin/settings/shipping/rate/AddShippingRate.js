/** @jsx jsx */
import { jsx } from '@emotion/core';
import { ScDialog } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import ShippingRateForm from './ShippingRateForm';

export default ({
	open,
	onRequestClose,
	shippingZoneId,
	onUpgradeRequired,
}) => {
	return (
		<ScDialog
			open={open}
			label={__('Add New Shipping Rate', 'surecart')}
			onScRequestClose={onRequestClose}
			style={{ '--dialog-body-overflow': 'visible' }}
		>
			<ShippingRateForm
				onRequestClose={onRequestClose}
				shippingZoneId={shippingZoneId}
				onUpgradeRequired={onUpgradeRequired}
			/>
		</ScDialog>
	);
};
