import { CeButton } from '@checkout-engine/react';
import { __ } from '@wordpress/i18n';

import Box from '../../ui/Box';
import useCustomerData from '../hooks/useCustomerData';

export default () => {
	const { customer, loading } = useCustomerData();

	const renderLoading = () => {
		return <ce-skeleton></ce-skeleton>;
	};

	return (
		<Box
			title={ __( 'Customer', 'checkout_engine' ) }
			footer={
				<div>
					<CeButton href="">Edit Customer</CeButton>
				</div>
			}
		>
			{ loading ? (
				renderLoading()
			) : (
				<div>
					<div>{ customer?.name }</div>
					<div>{ customer?.email }</div>
					<div>{ customer?.billing_address }</div>
				</div>
			) }
		</Box>
	);
};
