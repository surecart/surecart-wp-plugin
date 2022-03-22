import { ScButton } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import useEntity from '../../../mixins/useEntity';
import Box from '../../../ui/Box';
import { addQueryArgs } from '@wordpress/url';

export default ({ subscription, loading }) => {
	const { customer } = useEntity('customer', subscription?.customer);

	return (
		<Box
			title={__('Customer', 'surecart')}
			loading={loading}
			footer={
				!loading && (
					<div>
						<ScButton
							href={addQueryArgs('admin.php', {
								page: 'sc-customers',
								action: 'edit',
								id: subscription?.customer,
							})}
						>
							{__('Edit Customer', 'surecart')}
						</ScButton>
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
