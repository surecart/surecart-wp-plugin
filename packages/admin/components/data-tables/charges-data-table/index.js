/** @jsx jsx */
import DataTable from '../../DataTable';
import { css, jsx } from '@emotion/core';
import { ScButton } from '@surecart/components-react';
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

	const renderMethod = (charge) => {
		if (charge?.payment_method?.payment_instrument?.instrument_type) {
			return (
				<sc-tag type="info" pill>
					<span style={{ textTransform: 'capitalize' }}>
						{
							charge?.payment_method?.payment_instrument
								?.instrument_type
						}{' '}
					</span>
				</sc-tag>
			);
		}
		if (charge?.payment_method?.card?.brand) {
			return (
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 1em;
					`}
				>
					<sc-cc-logo
						style={{ fontSize: '36px' }}
						brand={charge?.payment_method?.card?.brand}
					></sc-cc-logo>
					**** {charge?.payment_method?.card?.last4}
				</div>
			);
		}

		if (charge?.payment_intent?.processor_type === 'paypal') {
			return (
				<sc-tooltip
					type="text"
					style={{ display: 'inline-block' }}
					text={
						charge?.payment_intent?.processor_data?.paypal
							?.payer_email || __('Unknown email', 'surecart')
					}
				>
					<sc-icon
						name="paypal"
						style={{
							fontSize: '56px',
							lineHeight: '1',
							height: '28px',
						}}
					></sc-icon>
				</sc-tooltip>
			);
		}

		return charge?.payment_intent?.processor_type;
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
							method: renderMethod(charge),
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
