import { ScPaymentMethod } from '@surecart/components-react';
import { __, _n } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import DataTable from '../../../components/DataTable';
import { useSelect } from '@wordpress/data';
import Actions from './Actions';

export default ({ customerId }) => {
	const { paymentMethods, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'payment_method',
				{
					expand: [
						'card',
						'customer',
						'billing_agreement',
						'paypal_account',
						'payment_instrument',
						'bank_account',
					],
					customer_ids: [customerId],
				},
			];
			return {
				paymentMethods: select(coreStore).getEntityRecords(
					...queryArgs
				),
				loading: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
				loadError: select(coreStore)?.getResolutionError?.(
					'getEntityRecords',
					...queryArgs
				),
			};
		},
		[customerId]
	);

	return (
		<>
			<DataTable
				title={__('Payment Methods', 'surecart')}
				empty={__('None found.', 'surecart')}
				loading={loading}
				columns={{
					method: {
						label: __('Method', 'surecart'),
						width: '200px',
					},
					exp: {},
					action: {
						width: '100px',
					},
				}}
				items={paymentMethods?.map((item) => {
					return {
						method: <ScPaymentMethod paymentMethod={item} />,
						exp: (
							<div>
								{!!item?.card?.exp_month && (
									<span>
										{__('Exp.', 'surecart')}
										{item?.card?.exp_month}/
										{item?.card?.exp_year}
									</span>
								)}
								{!!item?.paypal_account?.email &&
									item?.paypal_account?.email}
							</div>
						),
						action: (
							<Actions
								customerId={customerId}
								paymentMethod={item}
								isDefault={
									item?.id ===
									item?.customer?.default_payment_method
								}
							/>
						),
					};
				})}
			/>
		</>
	);
};
