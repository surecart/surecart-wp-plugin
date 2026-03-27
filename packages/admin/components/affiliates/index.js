/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies.
 */
import ConnectAffiliate from './ConnectAffiliate';
import ViewAffiliate from './ViewAffiliate';
import Box from '../../ui/Box';
import AffiliateFooter from './AffiliateFooter';

export default ({ item, updateItem, loading, commissionText }) => {
	const { affiliation, fetching } = useSelect(
		(select) => {
			if (!item?.affiliation) {
				return {
					affiliation: null,
					fetching: false,
				};
			}
			const queryArgs = ['surecart', 'affiliation', item.affiliation];
			return {
				affiliation: select(coreStore).getEntityRecord(...queryArgs),
				fetching: select(coreStore).isResolving(
					'getEntityRecord',
					queryArgs
				),
			};
		},
		[item?.affiliation]
	);

	return (
		<Box
			title={__('Affiliate Commissions', 'surecart')}
			loading={fetching || loading}
			footer={
				!!item?.affiliation && (
					<AffiliateFooter
						item={item}
						updateItem={updateItem}
						commissionText={commissionText}
					/>
				)
			}
		>
			{!affiliation?.id ? (
				<ConnectAffiliate
					item={item}
					updateItem={updateItem}
					loading={fetching || loading}
				/>
			) : (
				<ViewAffiliate
					item={item}
					updateItem={updateItem}
					affiliation={affiliation}
					loading={fetching || loading}
					commissionText={commissionText}
				/>
			)}
		</Box>
	);
};
