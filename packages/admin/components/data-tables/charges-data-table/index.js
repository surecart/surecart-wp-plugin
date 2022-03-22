/** @jsx jsx */
import { __, _n } from '@wordpress/i18n';
import DataTable from '../../DataTable';
import { css, jsx } from '@emotion/core';
import { store } from '@surecart/data';
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
	...props
}) => {
	const [confirmRefund, setConfirmRefund] = useState(false);

	const renderStatusTag = (charge) => {
		if (charge?.fully_refunded) {
			return <sc-tag type="danger">{__('Refunded', 'surecart')}</sc-tag>;
		}

		if (charge?.refunded_amount && charge?.refunded_amount) {
			return (
				<sc-tag type="warning">
					{__('Partially Refunded', 'surecart')}{' '}
				</sc-tag>
			);
		}

		return <sc-tag type="success">{__('Paid', 'surecart')}</sc-tag>;
	};

	const renderRefundButton = (charge) => {
		if (charge?.fully_refunded) {
			return null;
		}

		return (
			<sc-button
				onClick={() =>
					setConfirmRefund({
						charge,
					})
				}
				size="small"
			>
				{__('Refund', 'surecart')}
			</sc-button>
		);
	};

	return (
		<Fragment>
			<DataTable
				title={title || __('Charges', 'surecart')}
				columns={columns}
				empty={empty || __('None found.', 'surecart')}
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
								<sc-text
									style={{
										'--font-weight':
											'var(--sc-font-weight-bold)',
									}}
								>
									<sc-format-number
										type="currency"
										currency={currency}
										value={amount}
									></sc-format-number>
									{!!charge?.refunded_amount && (
										<div
											style={{
												color: 'var(--sc-color-danger-500)',
											}}
										>
											-{' '}
											<sc-format-number
												type="currency"
												currency={charge?.currency}
												value={charge?.refunded_amount}
											></sc-format-number>{' '}
											{__('Refunded', 'surecart')}
										</div>
									)}
								</sc-text>
							),
							date: (
								<sc-format-date
									type="timestamp"
									date={created_at}
									month="long"
									day="numeric"
									year="numeric"
								></sc-format-date>
							),
							method: payment_method?.card?.brand && (
								<div
									css={css`
										display: flex;
										align-items: center;
										gap: 1em;
									`}
								>
									<sc-cc-logo
										style={{ fontSize: '36px' }}
										brand={payment_method?.card?.brand}
									></sc-cc-logo>
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
				{...props}
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
