/**
 * External dependencies.
 */
import { Fragment } from '@wordpress/element';
import { __, _n } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies.
 */
import DataTable from '../../DataTable';
import {
	ScButton,
	ScPaymentMethod,
	ScDropdown,
	ScIcon,
	ScMenu,
	ScMenuItem,
} from '@surecart/components-react';

export default ({
	data = [],
	isLoading,
	title,
	footer,
	error,
	isFetching,
	page,
	onRefundClick,
	onChargeClick,
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

		if (charge?.disputed_amount) {
			return <sc-tag type="danger">{charge?.dispute_status}</sc-tag>;
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
		if (charge?.fully_refunded || !onRefundClick || charge?.fully_disputed) {
			return null;
		}

		return (
			<ScMenuItem onClick={() => onRefundClick(charge)}>
				{__('Refund', 'surecart')}
			</ScMenuItem>
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
						const { currency, amount, created_at_date } = charge;
						return {
							amount: (
								<sc-text
									style={{
										'--font-weight':
											'var(--sc-font-weight-bold)',
									}}
								>
									{charge?.amount_display_amount}
									{!!charge?.refunded_amount && (
										<div
											style={{
												color: 'var(--sc-color-danger-500)',
											}}
										>
											- {charge?.refunded_display_amount}{' '}
											{__('Refunded', 'surecart')}
										</div>
									)}
									{!!charge?.disputed_amount && (
										<div
											style={{
												color: 'var(--sc-color-warning-500)',
											}}
										>
											- {charge?.disputed_display_amount}{' '}
											{__('Disputed', 'surecart')}
										</div>
									)}
								</sc-text>
							),
							date: created_at_date,
							method: (
								<ScPaymentMethod
									paymentMethod={charge?.payment_method}
									externalLink={charge?.external_charge_link}
									externalLinkTooltipText={`${__(
										'View charge on ',
										'surecart'
									)} ${
										charge?.payment_method?.processor_name
									}`}
								/>
							),
							status: renderStatusTag(charge),
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
							more: (
								<ScDropdown placement="bottom-end">
									<ScButton
										circle
										type="text"
										style={{
											'--button-color':
												'var(--sc-color-gray-600)',
											margin: '-10px',
										}}
										slot="trigger"
									>
										<ScIcon name="more-horizontal" />
									</ScButton>
									<ScMenu>
										{renderRefundButton(charge)}
										<ScMenuItem
											onClick={() =>
												onChargeClick(charge)
											}
										>
											{__('View Details', 'surecart')}
										</ScMenuItem>
									</ScMenu>
								</ScDropdown>
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
