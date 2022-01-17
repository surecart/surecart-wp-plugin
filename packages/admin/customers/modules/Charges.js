/** @jsx jsx */
import { __, _n } from '@wordpress/i18n';
import useCustomerData from '../hooks/useCustomerData';
import DataTable from '../../components/DataTable';
import { useEffect } from '@wordpress/element';
import { css, jsx } from '@emotion/core';
import useDataApi from '../../hooks/useDataApi';
import { addQueryArgs } from '@wordpress/url';
import { formatTime } from '../../util/time';

export default () => {
	const { customerId } = useCustomerData();
	const [{ data, isLoading, error, pagination }, fetchData] = useDataApi();

	useEffect(() => {
		if (customerId) {
			fetchData({
				path: 'checkout-engine/v1/charges',
				query: {
					customer_ids: [customerId],
					context: 'edit',
					status: ['paid'],
					expand: ['payment_method', 'payment_method.card'],
				},
			});
		}
	}, [customerId]);

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

	return (
		<DataTable
			title={__('Charges', 'checkout_engine')}
			columns={{
				amount: {
					label: __('Amount', 'checkout_engine'),
				},
				date: {
					label: __('Date', 'checkout_engine'),
				},
				method: {
					label: __('Method', 'checkout_engine'),
				},
				status: {
					label: __('Status', 'checkout_engine'),
					width: '100px',
				},
				actions: {
					width: '100px',
				},
			}}
			items={(data || []).map((charge) => {
				const { currency, amount, id, created_at, payment_method } =
					charge;
				return {
					amount: (
						<ce-text
							style={{
								'--font-weight': 'var(--ce-font-weight-bold)',
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
						<div>
							{formatTime(created_at, {
								dateStyle: 'medium',
								timeStyle: 'short',
							})}
						</div>
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
					actions: (
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
				};
			})}
			loading={isLoading}
			footer={footer}
		/>
	);
};
