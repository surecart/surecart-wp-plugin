import { CeButton } from '@checkout-engine/components-react';
import { __ } from '@wordpress/i18n';
import useEntity from '../../../mixins/useEntity';
import Box from '../../../ui/Box';
import { addQueryArgs } from '@wordpress/url';

export default ({ subscription, loading }) => {
	const { customer } = useEntity('customer', subscription?.customer);

	return (
		<Box
			title={__('Customer', 'checkout_engine')}
			loading={loading}
			footer={
				!loading && (
					<div>
						<CeButton
							href={addQueryArgs('admin.php', {
								page: 'ce-customers',
								action: 'edit',
								id: subscription?.customer,
							})}
						>
							{__('Edit Customer', 'checkout_engine')}
						</CeButton>
					</div>
				)
			}
		>
			<div>
				{!!customer?.name && (
					<div>
						<strong>{customer?.name}</strong>
					</div>
				)}
				{customer?.email}
			</div>
		</Box>
	);
};
