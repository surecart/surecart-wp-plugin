/** @jsx jsx */
import { __, _n } from '@wordpress/i18n';
import DataTable from '../../DataTable';
import { css, jsx } from '@emotion/core';
import { store } from '@checkout-engine/data';
import Refund from './Refund';
import { Fragment } from '@wordpress/element';
import { useState } from '@wordpress/element';
import { select } from '@wordpress/data';
import PaginationFooter from '../PaginationFooter';

export default ({
	data,
	isLoading,
	title,
	error,
	isFetching,
	page,
	setPage,
	pagination,
	columns,
	empty,
}) => {
	const [confirmRefund, setConfirmRefund] = useState(false);

	const renderStatusTag = (charge) => {
		if (charge?.fully_refunded) {
			return (
				<ce-tag type="danger">
					{__('Refunded', 'checkout_engine')}
				</ce-tag>
			);
		}

		if (charge?.refunded_amount && charge?.refunded_amount) {
			return (
				<ce-tag type="warning">
					{__('Partially Refunded', 'checkout_engine')}{' '}
				</ce-tag>
			);
		}

		return <ce-tag type="success">{__('Paid', 'checkout_engine')}</ce-tag>;
	};

	const renderRefundButton = (charge) => {
		if (charge?.fully_refunded) {
			return null;
		}

		// const order = select(store).selectRelation(
		// 	'charge',
		// 	charge?.id,
		// 	'order'
		// );

		// const invoice = select(store).selectRelation(
		// 	'charge',
		// 	charge?.id,
		// 	'invoice.subscription'
		// );

		// console.log({ order, invoice });

		// a charges invoice->subscription->subscription
		// a charges order->purchase

		return (
			<ce-button
				onClick={() =>
					setConfirmRefund({
						charge,
					})
				}
				size="small"
			>
				{__('Refund', 'checkout_engine')}
			</ce-button>
		);
	};

	return (
		<Fragment>
			<DataTable
				title={title || __('Charges', 'checkout_engine')}
				columns={columns}
				empty={empty || __('None found.', 'checkout-engine')}
				items={(data || [])
					.sort((a, b) => b.created_at - a.created_at)
					.map((charge) => {
						const {
							currency,
							amount,
							id,
							created_at,
							payment_method,
						} = charge;
						return {
							amount: (
								<ce-text
									style={{
										'--font-weight':
											'var(--ce-font-weight-bold)',
									}}
								>
									<ce-format-number
										type="currency"
										currency={currency}
										value={amount}
									></ce-format-number>
									{!!charge?.refunded_amount && (
										<div
											style={{
												color: 'var(--ce-color-danger-500)',
											}}
										>
											-{' '}
											<ce-format-number
												type="currency"
												currency={charge?.currency}
												value={charge?.refunded_amount}
											></ce-format-number>{' '}
											{__('Refunded', 'checkout_engine')}
										</div>
									)}
								</ce-text>
							),
							date: (
								<ce-format-date
									type="timestamp"
									date={created_at}
									month="long"
									day="numeric"
									year="numeric"
								></ce-format-date>
							),
							method: payment_method?.card?.brand && (
								<div
									css={css`
										display: flex;
										align-items: center;
										gap: 1em;
									`}
								>
									<ce-cc-logo
										style={{ fontSize: '36px' }}
										brand={payment_method?.card?.brand}
									></ce-cc-logo>
									**** {payment_method?.card?.last4}
								</div>
							),
							status: renderStatusTag(charge),
							refund: renderRefundButton(charge),
						};
					})}
				loading={isLoading}
				footer={
					pagination ? (
						<PaginationFooter
							showing={data?.length}
							total={pagination?.total}
							total_pages={pagination?.total_pages}
							page={page}
							isFetching={isFetching}
							setPage={setPage}
						/>
					) : null
				}
			></DataTable>
			{confirmRefund && (
				<Refund
					charge={confirmRefund?.charge}
					onRequestClose={() => setConfirmRefund(false)}
				/>
			)}
		</Fragment>
	);
};
