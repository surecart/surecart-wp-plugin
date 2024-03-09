/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies.
 */
import Box from '../../../ui/Box';
import ConnectAffiliate from './ConnectAffiliate';
import ViewAffiliate from './ViewAffiliate';

export default ({ customer, updateCustomer, loading }) => {
	const { affiliation, fetching } = useSelect(
		(select) => {
			if (!customer?.affiliation) {
				return {
					affiliation: null,
					fetching: false,
				};
			}
			const queryArgs = ['surecart', 'affiliation', customer.affiliation];
			return {
				affiliation: select(coreStore).getEntityRecord(...queryArgs),
				fetching: select(coreStore).isResolving(
					'getEntityRecord',
					queryArgs
				),
			};
		},
		[customer?.affiliation]
	);

	return (
		<Box
			title={__('Affiliate Commissions', 'surecart')}
			loading={fetching || loading}
		>
			{!affiliation?.id ? (
				<ConnectAffiliate
					customer={customer}
					updateCustomer={updateCustomer}
					loading={fetching || loading}
				/>
			) : (
				<ViewAffiliate
					customer={customer}
					updateCustomer={updateCustomer}
					affiliation={affiliation}
					loading={fetching || loading}
				/>
			)}
		</Box>
	);
};
