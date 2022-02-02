/** @jsx jsx */
import { __, _n } from '@wordpress/i18n';
import DataTable from '../../DataTable';
import { css, jsx } from '@emotion/core';
import { addQueryArgs } from '@wordpress/url';
import Refund from './Refund';
import { Fragment } from '@wordpress/element';
import { useState } from '@wordpress/element';

export default ({
	data,
	isLoading,
	error,
	pagination,
	columns,
	empty,
	purchases,
}) => {
	const [confirmRefund, setConfirmRefund] = useState(false);

	const footer = (
		<div>
			{sprintf(__('%s Total', 'checkout_engine'), pagination?.total || 0)}
		</div>
	);

	const renderStatusTag = (charge) => {
		if (charge?.fully_refunded) {
			return (
				<ce-tag type="danger">
					{__('Refunded', 'checkout_engine')}
				</ce-tag>
			);
		}

		if (charge?.refunded_amount) {
			return (
				<ce-tag>{__('Partially Refunded', 'checkout_engine')}</ce-tag>
			);
		}

		return <ce-tag type="success">{__('Paid', 'checkout_engine')}</ce-tag>;
	};

	const onRefund = (charge) => {
		setConfirmRefund({
			charge,
			purchases,
		});
	};

	return (
		<Fragment>
			<DataTable
				title={__('Payments', 'checkout_engine')}
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
						edit: (
							<ce-button
								href={addQueryArgs('admin.php', {
									page: 'ce-orders',
									action: 'edit',
									id: id,
								})}
								size="small"
							>
								{__('View', 'checkout_engine')}
							</ce-button>
						),
						refund: (
							<ce-button
								onClick={() => onRefund(charge)}
								size="small"
							>
								{__('Refund', 'checkout_engine')}
							</ce-button>
						),
					};
				})}
				loading={isLoading}
				footer={footer}
			/>
			{confirmRefund && (
				<Refund
					purchases={confirmRefund?.purchases}
					charge={confirmRefund?.charge}
					onRequestClose={() => setConfirmRefund(false)}
				/>
			)}
		</Fragment>
	);
};
