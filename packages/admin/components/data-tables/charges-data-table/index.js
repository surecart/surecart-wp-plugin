/** @jsx jsx */
import DataTable from '../../DataTable';
import { css, jsx } from '@emotion/core';
import { ScButton, ScPaymentMethod } from '@surecart/components-react';
import { Fragment } from '@wordpress/element';
import { __, _n } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

export default ({
	data = [],
	isLoading,
	title,
	footer,
	error,
	isFetching,
	page,
	onRefundClick,
	setPage,
	pagination,
	columns,
	empty,
	...props
}) => {
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
		if (!onRefundClick) {
			return null;
		}

		return (
			<sc-button onClick={() => onRefundClick(charge)} size="small">
				{__('Refund', 'surecart')}
			</sc-button>
		);
	};

	return (
		<Fragment>
			<DataTable
				title={title || __('Charges', 'surecart')}
				columns={columns}
				empty={empty || __('No charges', 'surecart')}
				items={(data || [])
					.sort((a, b) => b.created_at - a.created_at)
					.map((charge) => {
						const { currency, amount, created_at } = charge;
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
							method: (
								<ScPaymentMethod
									paymentMethod={charge?.payment_method}
								/>
							),
							status: renderStatusTag(charge),
							refund: renderRefundButton(charge),
							order: charge?.checkout?.order?.id && (
								<ScButton
									href={addQueryArgs('admin.php', {
										page: 'sc-orders',
										action: 'edit',
										id: charge?.checkout?.order?.id,
									})}
									size="small"
								>
									{__('View Order', 'surecart')}
								</ScButton>
							),
						};
					})}
				loading={isLoading}
				updating={isFetching}
				footer={!!footer && footer}
				{...props}
			/>
		</Fragment>
	);
};
