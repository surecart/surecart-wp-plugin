import DataTable from '../../../components/DataTable';
import usePagination from '../../../hooks/usePagination';
import PrevNextButtons from '../../../ui/PrevNextButtons';
import {
	ScButton,
	ScDropdown,
	ScFlex,
	ScFormatDate,
	ScFormatNumber,
	ScIcon,
	ScMenu,
	ScMenuItem,
	ScOrderStatusBadge,
	ScText,
} from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import RetryPaymentModal from './modals/RetryPaymentModal';

export default ({ subscriptionId }) => {
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(10);
	const [confirm, setConfirm] = useState(false);
	const { periods, updating, loading } = useSelect(
		(select) => {
			if (!subscriptionId) {
				return {
					periods: [],
					loading: true,
				};
			}
			const entityData = [
				'surecart',
				'period',
				{
					subscription_ids: [subscriptionId],
					page,
					per_page: perPage,
					expand: [
						'checkout',
						'checkout.charge',
						'checkout.payment_method',
						'payment_method.card',
						'payment_method.payment_instrument',
						'payment_method.paypal_account',
						'payment_method.bank_account',
					],
				},
			];
			const loading = !select(coreStore)?.hasFinishedResolution?.(
				'getEntityRecords',
				[...entityData]
			);

			return {
				periods: select(coreStore)?.getEntityRecords?.(...entityData),
				loading: loading && page === 1,
				updating: loading && page !== 1,
			};
		},
		[subscriptionId, page, perPage]
	);

	const { hasPagination } = usePagination({
		data: periods,
		page,
		perPage,
	});

	return (
		<>
			<DataTable
				title={__('Billing Periods', 'surecart')}
				loading={loading}
				updating={updating}
				columns={{
					amount: {
						label: __('Amount', 'surecart'),
						width: '100px',
					},
					period: {
						label: __('Time Period', 'surecart'),
						width: '30%',
					},
					status: {
						label: __('Status', 'surecart'),
						width: '200px',
					},
					view: {
						width: '50px',
					},
				}}
				empty={__('No billing periods', 'surecart')}
				items={(periods || [])
					.sort((a, b) => b.created_at - a.created_at)
					.map((period) => {
						return {
							period: (
								<>
									<ScFormatDate
										type="timestamp"
										date={period?.start_at}
										month="short"
										day="numeric"
										year="numeric"
									/>{' '}
									&mdash;{' '}
									<ScFormatDate
										type="timestamp"
										date={period?.end_at}
										month="short"
										day="numeric"
										year="numeric"
									/>
								</>
							),
							amount: (
								<ScFormatNumber
									type="currency"
									currency={period?.checkout?.currency}
									value={period?.checkout?.amount_due || 0}
								/>
							),
							status: (
								<ScFlex
									flexDirection="column"
									style={{ '--spacing': '0.25em' }}
								>
									<ScOrderStatusBadge
										status={period?.status}
									/>
									{!!period?.next_payment_retry_at && (
										<div
											style={{
												color: 'var(--sc-color-gray-600)',
											}}
										>
											{__('Next retry:', 'surecart')}{' '}
											<ScFormatDate
												type="timestamp"
												date={
													period?.next_payment_retry_at
												}
												month="short"
												hour="numeric"
												minute="numeric"
												day="numeric"
												year="numeric"
											/>
										</div>
									)}
								</ScFlex>
							),
							view: (
								<ScDropdown placement="bottom-end">
									<ScButton type="text" slot="trigger">
										<ScIcon name="more-horizontal" />
									</ScButton>
									<ScMenu>
										{period?.status ===
											'payment_failed' && (
											<ScMenuItem
												onClick={() =>
													setConfirm(period)
												}
											>
												<ScIcon
													name="repeat"
													slot="prefix"
												/>
												{__(
													'Retry Payment',
													'surecart'
												)}
											</ScMenuItem>
										)}
										<ScMenuItem
											href={addQueryArgs('admin.php', {
												page: 'sc-orders',
												action: 'edit',
												id:
													period?.checkout?.order
														?.id ||
													period?.checkout?.order,
											})}
										>
											<ScIcon
												name="shopping-bag"
												slot="prefix"
											/>
											{__('View Order', 'surecart')}
										</ScMenuItem>
									</ScMenu>
								</ScDropdown>
							),
						};
					})}
				footer={
					hasPagination && (
						<PrevNextButtons
							data={periods}
							page={page}
							setPage={setPage}
							perPage={perPage}
							loading={updating}
						/>
					)
				}
			/>
			<RetryPaymentModal
				period={confirm}
				open={confirm?.id}
				onRequestClose={() => setConfirm(false)}
			/>
		</>
	);
};
