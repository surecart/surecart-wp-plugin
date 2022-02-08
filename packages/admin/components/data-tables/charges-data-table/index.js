/** @jsx jsx */
import { __, _n } from '@wordpress/i18n';
import DataTable from '../../DataTable';
import { css, jsx } from '@emotion/core';
import { store as coreStore } from '@wordpress/core-data';
import Refund from './Refund';
import { Fragment } from '@wordpress/element';
import { useState } from '@wordpress/element';
import { select } from '@wordpress/data';

export default ({
	data,
	isLoading,
	error,
	title,
	pagination,
	showTotal,
	columns,
	empty,
	onUpdateItem,
}) => {
	const [confirmRefund, setConfirmRefund] = useState(false);

	const footer = () => {
		if (showTotal) {
			const totals = (data || [])
				.map((item) => item.amount - item.refunded_amount)
				.reduce((a, b) => a + b, 0);
			if (data && data.length > 0) {
				return (
					<ce-line-item
						style={{
							width: '100%',
							'--price-size': 'var(--ce-font-size-x-large)',
						}}
					>
						<span slot="title">
							{__('Total Payment', 'checkout_engine')}
						</span>
						<span slot="price">
							<ce-format-number
								type="currency"
								currency={data?.[0]?.currency}
								value={totals}
							></ce-format-number>
						</span>
						<span slot="currency">{data?.[0]?.currency}</span>
					</ce-line-item>
				);
			}
		}
		return (
			<div>
				{sprintf(
					__('%s Total', 'checkout_engine'),
					pagination?.total || 0
				)}
			</div>
		);
	};

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
				title={title || __('Payments', 'checkout_engine')}
				columns={columns}
				empty={empty || __('None found.', 'checkout-engine')}
				items={(data || []).map((charge) => {
					const { currency, amount, id, created_at, payment_method } =
						charge;
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
				footer={footer()}
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
